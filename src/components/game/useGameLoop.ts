import { useRef, useCallback } from 'react';
import type { Ball, Brick, Paddle, ParticleData, Rect } from './types';
import { spawnParticles, spawnCelebration, updateParticles } from './particles';

const BALL_SPEED_MIN = 3; // px per frame at 60fps – starting speed
const BALL_SPEED_MAX = 9; // px per frame at 60fps – max speed at top row
const BALL_RADIUS = 8;

interface GameRefs {
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  particles: ParticleData[];
  playArea: Rect;
  mouseX: number;
  paused: boolean;
  gameEnded: boolean;
  highestRow: number;
  rowCount: number;
  brickRowMap: Map<number, number>;
}

interface DomRefs {
  ballEl: HTMLDivElement | null;
  brickEls: Map<number, HTMLElement>;
  particleEls: HTMLDivElement[];
}

interface GameLoopCallbacks {
  onBrickDestroyed: (brick: Brick) => void;
  onWin: () => void;
  onLose: () => void;
}

export function useGameLoop() {
  const gameRef = useRef<GameRefs>({
    ball: { x: 0, y: 0, vx: 0, vy: 0, radius: BALL_RADIUS, launched: false },
    paddle: { x: 0, y: 0, width: 0, height: 0 },
    bricks: [],
    particles: [],
    playArea: { x: 0, y: 0, width: 0, height: 0 },
    mouseX: 0,
    paused: false,
    gameEnded: false,
    highestRow: -1,
    rowCount: 0,
    brickRowMap: new Map(),
  });

  const domRef = useRef<DomRefs>({
    ballEl: null,
    brickEls: new Map(),
    particleEls: [],
  });

  const rafId = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const callbacksRef = useRef<GameLoopCallbacks>({
    onBrickDestroyed: () => {},
    onWin: () => {},
    onLose: () => {},
  });

  const renderDom = useCallback(() => {
    const { ball, particles, gameEnded } = gameRef.current;
    const dom = domRef.current;

    // Only render ball and paddle if game is still active
    if (!gameEnded) {
      if (dom.ballEl) {
        dom.ballEl.style.transform = `translate(${ball.x - ball.radius}px, ${ball.y - ball.radius}px)`;
      }
    }

    // Render particles into the pool
    for (let i = 0; i < dom.particleEls.length; i++) {
      const el = dom.particleEls[i];
      if (i < particles.length) {
        const p = particles[i];
        el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        el.style.opacity = String(p.life);
        el.style.width = `${p.size}px`;
        el.style.height = `${p.size}px`;
        el.style.background = `hsl(${p.hue}, 90%, 60%)`;
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  }, []);

  const tick = useCallback((timestamp: number) => {
    const game = gameRef.current;
    if (game.paused) {
      lastTime.current = timestamp;
      rafId.current = requestAnimationFrame(tick);
      return;
    }

    if (lastTime.current === 0) lastTime.current = timestamp;
    let dt = (timestamp - lastTime.current) / (1000 / 60); // normalize to 60fps frames
    lastTime.current = timestamp;

    // Cap dt to prevent tunneling on tab switch
    if (dt > 3) dt = 3;
    if (dt <= 0) dt = 1;

    // If game has ended, only update particles then self-terminate when done
    if (game.gameEnded) {
      game.particles = updateParticles(game.particles, dt);
      renderDom();
      if (game.particles.length > 0) {
        rafId.current = requestAnimationFrame(tick);
      }
      return;
    }

    const { ball, paddle, bricks, playArea } = game;

    // Move paddle to follow mouse
    const halfPaddle = paddle.width / 2;
    paddle.x = Math.max(
      playArea.x + halfPaddle,
      Math.min(playArea.x + playArea.width - halfPaddle, game.mouseX)
    );

    // Ball follows paddle if not launched
    if (!ball.launched) {
      ball.x = paddle.x;
      ball.y = paddle.y - ball.radius - 2;
      game.particles = updateParticles(game.particles, dt);
      renderDom();
      rafId.current = requestAnimationFrame(tick);
      return;
    }

    // Move ball
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Wall collisions (left, right, top)
    if (ball.x - ball.radius < playArea.x) {
      ball.x = playArea.x + ball.radius;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + ball.radius > playArea.x + playArea.width) {
      ball.x = playArea.x + playArea.width - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - ball.radius < playArea.y) {
      ball.y = playArea.y + ball.radius;
      ball.vy = Math.abs(ball.vy);
    }

    // Paddle collision
    if (
      ball.vy > 0 &&
      ball.y + ball.radius >= paddle.y &&
      ball.y + ball.radius <= paddle.y + paddle.height + ball.radius * 2 &&
      ball.x >= paddle.x - halfPaddle &&
      ball.x <= paddle.x + halfPaddle
    ) {
      // Map hit position to angle: left edge → 150°, center → 90°, right edge → 30°
      const hitPos = (ball.x - paddle.x) / halfPaddle; // -1 to 1
      const angle = ((1 - hitPos) / 2) * (Math.PI * 2 / 3) + Math.PI / 6; // 30° to 150°
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = Math.cos(angle) * speed;
      ball.vy = -Math.sin(angle) * speed;
      ball.y = paddle.y - ball.radius;
    }

    // Brick collision (circle vs AABB)
    for (const brick of bricks) {
      if (!brick.alive) continue;

      const r = brick.rect;
      // Find closest point on brick to ball center
      const closestX = Math.max(r.x, Math.min(ball.x, r.x + r.width));
      const closestY = Math.max(r.y, Math.min(ball.y, r.y + r.height));
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;
      const distSq = dx * dx + dy * dy;

      if (distSq < ball.radius * ball.radius) {
        brick.alive = false;

        // Determine which face was hit
        const overlapLeft = (ball.x + ball.radius) - r.x;
        const overlapRight = (r.x + r.width) - (ball.x - ball.radius);
        const overlapTop = (ball.y + ball.radius) - r.y;
        const overlapBottom = (r.y + r.height) - (ball.y - ball.radius);
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) {
          ball.vx = -ball.vx;
        } else {
          ball.vy = -ball.vy;
        }

        // Spawn particles at brick center
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        game.particles.push(...spawnParticles(cx, cy));

        // Fade out the word span
        const brickEl = domRef.current.brickEls.get(brick.id);
        if (brickEl) {
          brickEl.style.opacity = '0';
        }

        // Progressive speed: increase when reaching a new highest row
        const hitRow = game.brickRowMap.get(brick.id) ?? 0;
        if (hitRow > game.highestRow) {
          game.highestRow = hitRow;
          const targetSpeed =
            BALL_SPEED_MIN +
            (hitRow / Math.max(game.rowCount - 1, 1)) *
              (BALL_SPEED_MAX - BALL_SPEED_MIN);
          const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          const scale = targetSpeed / currentSpeed;
          ball.vx *= scale;
          ball.vy *= scale;
        }

        callbacksRef.current.onBrickDestroyed(brick);

        // Check win condition
        if (bricks.every((b) => !b.alive)) {
          game.gameEnded = true;
          ball.vx = 0;
          ball.vy = 0;
          game.particles.push(
            ...spawnCelebration(
              playArea.x,
              playArea.y,
              playArea.width,
              playArea.height
            )
          );
          renderDom();
          rafId.current = requestAnimationFrame(tick);
          callbacksRef.current.onWin();
          return;
        }

        break; // Only one brick collision per frame
      }
    }

    // Ball fell below play area
    if (ball.y - ball.radius > playArea.y + playArea.height) {
      game.gameEnded = true;
      renderDom();
      rafId.current = requestAnimationFrame(tick);
      callbacksRef.current.onLose();
      return;
    }

    // Update particles
    game.particles = updateParticles(game.particles, dt);

    renderDom();
    rafId.current = requestAnimationFrame(tick);
  }, [renderDom]);

  const start = useCallback(
    (
      playArea: Rect,
      bricks: Brick[],
      paddleY: number,
      paddleWidth: number,
      callbacks: GameLoopCallbacks
    ) => {
      const game = gameRef.current;
      game.playArea = playArea;
      game.bricks = bricks;
      game.paddle = {
        x: playArea.x + playArea.width / 2,
        y: paddleY,
        width: paddleWidth,
        height: 36,
      };
      game.ball = {
        x: game.paddle.x,
        y: paddleY - BALL_RADIUS - 2,
        vx: 0,
        vy: 0,
        radius: BALL_RADIUS,
        launched: false,
      };
      game.particles = [];
      game.paused = false;
      game.gameEnded = false;

      // Compute brick row mapping for progressive speed
      const uniqueYs: number[] = [];
      for (const b of bricks) {
        const cy = b.rect.y + b.rect.height / 2;
        if (!uniqueYs.some((y) => Math.abs(y - cy) < 2)) {
          uniqueYs.push(cy);
        }
      }
      // Sort descending: largest Y (closest to paddle) = row 0
      uniqueYs.sort((a, b) => b - a);
      const rowMap = new Map<number, number>();
      for (const b of bricks) {
        const cy = b.rect.y + b.rect.height / 2;
        const rowIndex = uniqueYs.findIndex((y) => Math.abs(y - cy) < 2);
        rowMap.set(b.id, rowIndex);
      }
      game.rowCount = uniqueYs.length;
      game.brickRowMap = rowMap;
      game.highestRow = -1;
      callbacksRef.current = callbacks;
      lastTime.current = 0;
      rafId.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    gameRef.current.paused = true;
  }, []);

  const launchBall = useCallback(() => {
    const ball = gameRef.current.ball;
    if (!ball.launched) {
      ball.launched = true;
      // Launch upward with slight random horizontal bias
      const angle = (Math.PI / 2) + (Math.random() - 0.5) * 0.6;
      ball.vx = Math.cos(angle) * BALL_SPEED_MIN;
      ball.vy = -Math.sin(angle) * BALL_SPEED_MIN;
    }
  }, []);

  const setMouseX = useCallback((x: number) => {
    gameRef.current.mouseX = x;
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    gameRef.current.paused = paused;
    if (!paused) {
      lastTime.current = 0;
    }
  }, []);

  return { gameRef, domRef, start, stop, launchBall, setMouseX, setPaused };
}
