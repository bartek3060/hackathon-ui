import { GAME_CONFIG } from "./constants";
import type {
  Entity,
  Player,
  Bullet,
  Enemy,
  Pickup,
  Particle,
  CollisionGrid,
  Vector2,
  PickupType,
} from "./types";

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function distance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function checkAABB(
  a: { x: number; y: number; size: number },
  b: { x: number; y: number; size: number }
): boolean {
  return (
    Math.abs(a.x - b.x) < (a.size + b.size) / 2 &&
    Math.abs(a.y - b.y) < (a.size + b.size) / 2
  );
}

export function createCollisionGrid(): CollisionGrid {
  const { GRID_COLS, GRID_ROWS } = GAME_CONFIG.COLLISION;
  const cellWidth = GAME_CONFIG.WIDTH / GRID_COLS;
  const cellHeight = GAME_CONFIG.HEIGHT / GRID_ROWS;
  
  const cells: Set<Entity>[][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    cells[row] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      cells[row][col] = new Set();
    }
  }
  
  return {
    cols: GRID_COLS,
    rows: GRID_ROWS,
    cellWidth,
    cellHeight,
    cells,
  };
}

export function clearGrid(grid: CollisionGrid): void {
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      grid.cells[row][col].clear();
    }
  }
}

export function addToGrid(grid: CollisionGrid, entity: Entity): void {
  if (!entity.active) return;
  
  const col = Math.floor(entity.position.x / grid.cellWidth);
  const row = Math.floor(entity.position.y / grid.cellHeight);
  
  if (col >= 0 && col < grid.cols && row >= 0 && row < grid.rows) {
    grid.cells[row][col].add(entity);
  }
}

export function getNearbyEntities(
  grid: CollisionGrid,
  entity: Entity
): Entity[] {
  const nearby: Entity[] = [];
  const col = Math.floor(entity.position.x / grid.cellWidth);
  const row = Math.floor(entity.position.y / grid.cellHeight);
  
  for (let r = Math.max(0, row - 1); r <= Math.min(grid.rows - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(grid.cols - 1, col + 1); c++) {
      grid.cells[r][c].forEach((e) => {
        if (e !== entity && e.active) {
          nearby.push(e);
        }
      });
    }
  }
  
  return nearby;
}

export function updateMovement(entities: Entity[], deltaTime: number): void {
  entities.forEach((entity) => {
    if (!entity.active) return;
    
    entity.position.x += entity.velocity.x * deltaTime;
    entity.position.y += entity.velocity.y * deltaTime;
  });
}

export function clampToScreen(entity: Entity): void {
  const halfSize = entity.size / 2;
  entity.position.x = Math.max(
    halfSize,
    Math.min(GAME_CONFIG.WIDTH - halfSize, entity.position.x)
  );
  entity.position.y = Math.max(
    halfSize,
    Math.min(GAME_CONFIG.HEIGHT - halfSize, entity.position.y)
  );
}

export function spawnEnemy(): Enemy {
  const x = Math.random() * GAME_CONFIG.WIDTH;
  const y = -GAME_CONFIG.ENEMY.SIZE;
  
  return {
    id: createId(),
    type: "enemy",
    position: { x, y },
    velocity: {
      x: (Math.random() - 0.5) * 50,
      y: GAME_CONFIG.ENEMY.BASE_SPEED,
    },
    size: GAME_CONFIG.ENEMY.SIZE,
    active: true,
    health: 1,
    points: GAME_CONFIG.ENEMY.POINTS,
  };
}

export function spawnPickup(type: PickupType): Pickup {
  const x = Math.random() * GAME_CONFIG.WIDTH;
  const y = -GAME_CONFIG.PICKUP.SIZE;
  
  let value = 0;
  switch (type) {
    case "coin":
      value = GAME_CONFIG.PICKUP.COIN_POINTS;
      break;
    case "health":
      value = GAME_CONFIG.PICKUP.HEALTH_RESTORE;
      break;
    case "education":
      value = GAME_CONFIG.PICKUP.EDU_MULTIPLIER;
      break;
  }
  
  return {
    id: createId(),
    type: "pickup",
    pickupType: type,
    position: { x, y },
    velocity: { x: 0, y: GAME_CONFIG.PICKUP.SPEED },
    size: GAME_CONFIG.PICKUP.SIZE,
    active: true,
    value,
  };
}

export function spawnBullet(player: Player): Bullet {
  return {
    id: createId(),
    type: "bullet",
    position: { x: player.position.x, y: player.position.y - 30 },
    velocity: { x: 0, y: -GAME_CONFIG.BULLET.SPEED },
    size: GAME_CONFIG.BULLET.SIZE,
    active: true,
    damage: 1,
  };
}

export function despawnOffscreen(entities: Entity[]): void {
  entities.forEach((entity) => {
    if (
      entity.position.y < -100 ||
      entity.position.y > GAME_CONFIG.HEIGHT + 100 ||
      entity.position.x < -100 ||
      entity.position.x > GAME_CONFIG.WIDTH + 100
    ) {
      entity.active = false;
    }
  });
}

export function createExplosion(
  position: Vector2,
  color: number = 0xFFFFFF
): Particle[] {
  const particles: Particle[] = [];
  const count = GAME_CONFIG.PARTICLES.EXPLOSION_COUNT;
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = GAME_CONFIG.PARTICLES.SPEED * (0.5 + Math.random() * 0.5);
    
    particles.push({
      id: createId(),
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      color,
      lifetime: 0,
      maxLifetime: GAME_CONFIG.PARTICLES.LIFETIME,
      size: 4 + Math.random() * 4,
    });
  }
  
  return particles;
}

export function updateParticles(particles: Particle[], deltaTime: number): void {
  particles.forEach((particle) => {
    particle.position.x += particle.velocity.x * deltaTime;
    particle.position.y += particle.velocity.y * deltaTime;
    particle.lifetime += deltaTime;
  });
}

export function removeDeadParticles(particles: Particle[]): Particle[] {
  return particles.filter((p) => p.lifetime < p.maxLifetime);
}

export function getDifficultyTier(elapsed: number): number {
  const tier = Math.floor(elapsed / GAME_CONFIG.DIFFICULTY.TIER_DURATION);
  return Math.min(tier, GAME_CONFIG.DIFFICULTY.MAX_TIER);
}

export function getSpawnRate(elapsed: number) {
  const tier = getDifficultyTier(elapsed);
  return GAME_CONFIG.SPAWN_RATES[tier];
}

export function updateMultiplierDecay(
  currentMultiplier: number,
  deltaTime: number
): number {
  if (currentMultiplier > 1) {
    return Math.max(1, currentMultiplier - GAME_CONFIG.SCORE.MULTIPLIER_DECAY * deltaTime);
  }
  return 1;
}

export function incrementMultiplier(currentMultiplier: number): number {
  return Math.min(
    GAME_CONFIG.SCORE.MAX_MULTIPLIER,
    currentMultiplier + 0.5
  );
}


