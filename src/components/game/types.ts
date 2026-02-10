export type Phase = 'idle' | 'starting' | 'playing' | 'ending';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  launched: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Brick {
  id: number;
  word: string;
  rect: Rect;
  alive: boolean;
}

export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
}

export interface GameState {
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  particles: ParticleData[];
  playArea: Rect;
}
