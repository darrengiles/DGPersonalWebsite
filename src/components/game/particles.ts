import type { ParticleData } from './types';

const RAINBOW_HUES = [0, 30, 60, 120, 200, 270, 310];

function randomHue(): number {
  return RAINBOW_HUES[Math.floor(Math.random() * RAINBOW_HUES.length)];
}

/** Spawn 8-12 rainbow particles at a brick's center */
export function spawnParticles(cx: number, cy: number): ParticleData[] {
  const count = 8 + Math.floor(Math.random() * 5);
  const particles: ParticleData[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.4,
      hue: randomHue(),
      size: 3 + Math.random() * 4,
    });
  }
  return particles;
}

/** Spawn 100 celebration particles spread across the play area */
export function spawnCelebration(
  areaX: number,
  areaY: number,
  areaWidth: number,
  areaHeight: number
): ParticleData[] {
  const particles: ParticleData[] = [];
  for (let i = 0; i < 100; i++) {
    const x = areaX + Math.random() * areaWidth;
    const y = areaY + areaHeight * 0.3 + Math.random() * areaHeight * 0.4;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
    const speed = 3 + Math.random() * 6;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1,
      maxLife: 1.5 + Math.random() * 1,
      hue: randomHue(),
      size: 4 + Math.random() * 6,
    });
  }
  return particles;
}

/** Update all particles: apply gravity, fade, and remove dead ones */
export function updateParticles(
  particles: ParticleData[],
  dt: number
): ParticleData[] {
  const gravity = 0.15;
  const alive: ParticleData[] = [];
  for (const p of particles) {
    p.vy += gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= (dt / 60) / p.maxLife;
    if (p.life > 0) {
      alive.push(p);
    }
  }
  return alive;
}
