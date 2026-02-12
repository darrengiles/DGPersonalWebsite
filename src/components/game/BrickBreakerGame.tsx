'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Brick, Phase, Rect } from './types';
import { useGameLoop } from './useGameLoop';
import styles from '@/styles/brickBreaker.module.css';

const PARTICLE_POOL_SIZE = 150;

interface BrickBreakerGameProps {
  description: string;
  children: ReactNode;
}

export default function BrickBreakerGame({
  description,
  children,
}: BrickBreakerGameProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const particlePoolRef = useRef<HTMLDivElement[]>([]);

  // Saved state for cleanup
  const originalHTMLRef = useRef<string>('');
  const eduH2Ref = useRef<HTMLElement | null>(null);
  const aboutPRef = useRef<HTMLElement | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const gameActiveRef = useRef(false);
  const endingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Double-click tracking (two clicks within 500ms)
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { domRef, start, stop, launchBall, setMouseX, setPaused } =
    useGameLoop();

  // Desktop detection
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktop(query.matches);
  }, []);

  // Measure word positions by wrapping <p> innerHTML with spans
  const setupWords = useCallback((): { bricks: Brick[]; aboutP: HTMLElement } | null => {
    const container = containerRef.current;
    if (!container) return null;

    const aboutP = container.querySelector('.about p') as HTMLElement | null;
    if (!aboutP) return null;

    const containerRect = container.getBoundingClientRect();

    // Save original HTML for restoration
    originalHTMLRef.current = aboutP.innerHTML;
    aboutPRef.current = aboutP;

    // Split text content into words, wrap each in a span
    const words = description.split(/\s+/).filter(Boolean);
    aboutP.innerHTML = words
      .map((w, i) => `<span class="${styles['game-word']}" data-brick="${i}">${w}</span>`)
      .join(' ');

    const bricks: Brick[] = [];
    const spanMap = new Map<number, HTMLElement>();
    const spans = aboutP.querySelectorAll<HTMLSpanElement>('span[data-brick]');
    spans.forEach((span, i) => {
      const rect = span.getBoundingClientRect();
      bricks.push({
        id: i,
        word: words[i],
        rect: {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        },
        alive: true,
      });
      spanMap.set(i, span);
    });

    // Wire up brick elements for the game loop
    domRef.current.brickEls = spanMap;

    return { bricks, aboutP };
  }, [description, domRef]);

  // Compute play area bounds
  const computePlayArea = useCallback((): {
    area: Rect;
    paddleY: number;
    paddleW: number;
  } | null => {
    const container = containerRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const aboutSection = container.querySelector('.about');
    const educationH2 = container.querySelector('#education');

    if (!aboutSection || !educationH2) return null;

    const aboutRect = aboutSection.getBoundingClientRect();
    const eduRect = educationH2.getBoundingClientRect();

    const top = aboutRect.top - containerRect.top;
    const bottom = eduRect.bottom - containerRect.top;
    const paddleY = eduRect.top - containerRect.top;

    return {
      area: {
        x: 0,
        y: top,
        width: containerRect.width,
        height: bottom - top,
      },
      paddleY,
      paddleW: eduRect.width,
    };
  }, []);

  // Immediate DOM restoration — used at the end of ending animation,
  // on Escape from any non-idle phase, and on window resize.
  const cleanupGame = useCallback(() => {
    gameActiveRef.current = false;
    stop();

    // Clear any pending ending timer
    if (endingTimerRef.current) {
      clearTimeout(endingTimerRef.current);
      endingTimerRef.current = null;
    }

    // Restore original paragraph HTML
    if (aboutPRef.current && originalHTMLRef.current) {
      aboutPRef.current.innerHTML = originalHTMLRef.current;
    }

    // Reset education h2 styles
    if (eduH2Ref.current) {
      eduH2Ref.current.style.transform = '';
      eduH2Ref.current.style.transition = '';
      eduH2Ref.current.style.width = '';
      eduH2Ref.current.style.marginInline = '';
      eduH2Ref.current.classList.remove('game-paddle-glow');
      eduH2Ref.current = null;
    }

    // Reset about section spacing
    if (aboutSectionRef.current) {
      aboutSectionRef.current.style.marginBottom = '';
      aboutSectionRef.current.style.transition = '';
      aboutSectionRef.current = null;
    }

    // Reset container styles
    if (containerRef.current) {
      containerRef.current.style.userSelect = '';
      containerRef.current.style.webkitUserSelect = '';
    }

    // Reset ball styles (overlay persists in DOM, so reset manually)
    if (ballRef.current) {
      ballRef.current.style.transition = '';
      ballRef.current.style.opacity = '';
    }

    // Hide all particles (don't clear refs — overlay stays mounted)
    for (const el of particlePoolRef.current) {
      el.style.display = 'none';
    }

    setPhase('idle');
  }, [stop]);

  // Start the game — triggers the starting phase (glow + spacing animation)
  const startGame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find Education h2 and shrink-wrap it so translateX works on compact text
    const eduH2 = container.querySelector('#education') as HTMLElement | null;
    if (!eduH2) return;
    eduH2Ref.current = eduH2;
    eduH2.style.width = 'fit-content';
    eduH2.style.marginInline = 'auto';  // keep it centered after shrink-wrapping

    // Add pulsing glow
    eduH2.classList.add('game-paddle-glow');

    // Open spacing between About section and Education heading
    const aboutSection = container.querySelector('.about') as HTMLElement | null;
    if (aboutSection) {
      aboutSectionRef.current = aboutSection;
      aboutSection.style.transition = 'margin-bottom 600ms ease-out';
      aboutSection.style.marginBottom = '80px';
    }

    // Prevent text selection while playing
    container.style.userSelect = 'none';
    container.style.webkitUserSelect = 'none';

    gameActiveRef.current = true;
    setPhase('starting');
  }, []);

  // starting → playing transition after 800ms
  useEffect(() => {
    if (phase !== 'starting') return;

    const timer = setTimeout(() => {
      // Guard: if game was cancelled during starting phase, bail
      if (!gameActiveRef.current) return;

      const eduH2 = eduH2Ref.current;
      if (eduH2) {
        eduH2.classList.remove('game-paddle-glow');
      }

      // Set up word bricks (measured after spacing has settled)
      const wordData = setupWords();
      if (!wordData) {
        cleanupGame();
        return;
      }

      const playInfo = computePlayArea();
      if (!playInfo) {
        cleanupGame();
        return;
      }

      setPhase('playing');

      // Wire DOM refs and start game loop in next frame
      requestAnimationFrame(() => {
        if (!gameActiveRef.current) return;

        domRef.current.ballEl = ballRef.current;
        domRef.current.particleEls = particlePoolRef.current;

        // Initialize mouseX to paddle center
        setMouseX(playInfo.area.x + playInfo.area.width / 2);

        start(
          playInfo.area,
          wordData.bricks,
          playInfo.paddleY,
          playInfo.paddleW,
          {
            onBrickDestroyed: () => {},
            onWin: () => {
              // Delay for celebration particles, then transition to ending
              endingTimerRef.current = setTimeout(() => setPhase('ending'), 2500);
            },
            onLose: () => {
              endingTimerRef.current = setTimeout(() => setPhase('ending'), 800);
            },
          }
        );

        // Auto-launch ball immediately
        launchBall();
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [phase, setupWords, computePlayArea, cleanupGame, domRef, start, launchBall, setMouseX]);

  // ending phase animation
  useEffect(() => {
    if (phase !== 'ending') return;

    // Stop the game loop
    stop();

    // Ball fade out
    if (ballRef.current) {
      ballRef.current.style.transition = 'opacity 500ms ease-out';
      ballRef.current.style.opacity = '0';
    }

    // Restore destroyed words (fade back in via existing .game-word transition)
    domRef.current.brickEls.forEach((span) => {
      span.style.opacity = '1';
    });

    // H2 fly back to center
    const eduH2 = eduH2Ref.current;
    if (eduH2) {
      eduH2.style.transition = 'transform 600ms ease-out';
      void eduH2.offsetHeight; // force reflow so browser sees the "from" transform
      eduH2.style.transform = '';
    }

    // Close spacing
    if (aboutSectionRef.current) {
      aboutSectionRef.current.style.marginBottom = '0';
    }

    // After animations complete, do full cleanup
    const timer = setTimeout(() => cleanupGame(), 800);
    return () => clearTimeout(timer);
  }, [phase, stop, domRef, cleanupGame]);

  // Double-click trigger on #education — idle phase only
  useEffect(() => {
    if (!isDesktop || phase !== 'idle') return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id !== 'education' && !target.closest('#education')) return;

      clickCountRef.current++;

      if (clickCountRef.current === 1) {
        // First click — start timer
        clickTimerRef.current = setTimeout(() => {
          clickCountRef.current = 0;
        }, 500);
      } else if (clickCountRef.current >= 2) {
        // Second click within window — start game
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        clickCountRef.current = 0;
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
        startGame();
      }
    };

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, [isDesktop, phase, startGame]);

  // Mouse tracking — move Education h2 as paddle (playing phase only)
  useEffect(() => {
    if (phase !== 'playing') return;

    const container = containerRef.current;
    const eduH2 = eduH2Ref.current;
    if (!container || !eduH2) return;

    // Cache the h2's original center position for offset calculation
    const containerRect = container.getBoundingClientRect();
    const eduRect = eduH2.getBoundingClientRect();
    const originalCenterX = eduRect.left + eduRect.width / 2 - containerRect.left;

    const handler = (e: MouseEvent) => {
      const cr = container.getBoundingClientRect();
      const mouseXInContainer = e.clientX - cr.left;

      // Clamp paddle within container bounds
      const halfW = eduH2.offsetWidth / 2;
      const clampedX = Math.max(halfW, Math.min(cr.width - halfW, mouseXInContainer));

      // Move h2 via translateX offset from its natural position
      const offset = clampedX - originalCenterX;
      eduH2.style.transform = `translateX(${offset}px)`;

      // Also update game loop's mouse position
      setMouseX(clampedX);
    };

    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [phase, setMouseX]);

  // Escape to exit (any non-idle phase) + visibility pause (playing only)
  useEffect(() => {
    if (phase === 'idle') return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanupGame();
      }
    };

    const handleVisibility = () => {
      if (phase === 'playing') {
        setPaused(document.hidden);
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [phase, cleanupGame, setPaused]);

  // Resize → exit game (any non-idle phase)
  useEffect(() => {
    if (phase === 'idle') return;

    const handler = () => cleanupGame();

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [phase, cleanupGame]);

  // SSR / mobile passthrough
  if (isDesktop === null || !isDesktop) {
    return <>{children}</>;
  }

  const showOverlay = phase === 'playing' || phase === 'ending';

  return (
    <div ref={containerRef} className={styles['brick-breaker-container']}>
      {/* Normal resume content — always visible */}
      {children}

      {/* Game overlay — always mounted so refs are stable; hidden when inactive */}
      <div
        ref={overlayRef}
        className={styles['game-overlay']}
        style={showOverlay ? undefined : { display: 'none' }}
      >
        <div ref={ballRef} className={styles['game-ball']} />

        {Array.from({ length: PARTICLE_POOL_SIZE }, (_, i) => (
          <div
            key={`particle-${i}`}
            ref={(el) => {
              if (el) particlePoolRef.current[i] = el;
            }}
            className={styles['game-particle']}
            style={{ display: 'none' }}
          />
        ))}
      </div>
    </div>
  );
}
