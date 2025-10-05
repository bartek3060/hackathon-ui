export interface Vector2 {
  x: number;
  y: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Entity {
  id: string;
  position: Vector2;
  velocity: Vector2;
  size: number;
  active: boolean;
  type: string;
}

export interface Player extends Entity {
  type: "player";
  lives: number;
  invulnerable: boolean;
  invulnerableTime: number;
  lastFireTime: number;
}

export interface Bullet extends Entity {
  type: "bullet";
  damage: number;
}

export interface Enemy extends Entity {
  type: "enemy";
  health: number;
  points: number;
}

export type PickupType = "coin" | "health" | "education";

export interface Pickup extends Entity {
  type: "pickup";
  pickupType: PickupType;
  value: number;
}

export interface Particle {
  id: string;
  position: Vector2;
  velocity: Vector2;
  color: number;
  lifetime: number;
  maxLifetime: number;
  size: number;
}

export interface CollisionGrid {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  cells: Set<Entity>[][];
}

export interface GameAssets {
  shipTexture: string;
  enemyTexture: string;
  coinTexture: string;
  healthTexture: string;
  educationTexture: string;
  particleTexture: string;
}

export interface DifficultyTier {
  enemyInterval: number;
  pickupInterval: number;
  speedMultiplier: number;
}


