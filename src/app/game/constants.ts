export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 1200,

  TARGET_FPS: 60,
  MAX_DELTA_TIME: 1000 / 30,

  PLAYER: {
    SPEED: 500,
    SIZE: 60,
    INITIAL_LIVES: 3,
    FIRE_RATE: 0.2,
    INVULNERABLE_TIME: 2,
  },

  BULLET: {
    SPEED: 600,
    SIZE: 8,
    MAX_POOL_SIZE: 50,
  },

  ENEMY: {
    BASE_SPEED: 150,
    SIZE: 50,
    MAX_ACTIVE: 20,
    POINTS: 50,
  },

  PICKUP: {
    SPEED: 120,
    SIZE: 40,
    MAX_ACTIVE: 10,
    COIN_POINTS: 100,
    HEALTH_RESTORE: 1,
    EDU_MULTIPLIER: 1.5,
  },

  SPAWN_RATES: [
    { enemyInterval: 2.0, pickupInterval: 4.0, speedMultiplier: 1.0 },
    { enemyInterval: 1.5, pickupInterval: 3.5, speedMultiplier: 1.2 },
    { enemyInterval: 1.2, pickupInterval: 3.0, speedMultiplier: 1.4 },
    { enemyInterval: 1.0, pickupInterval: 2.5, speedMultiplier: 1.6 },
    { enemyInterval: 0.8, pickupInterval: 2.0, speedMultiplier: 1.8 },
  ],

  DIFFICULTY: {
    TIER_DURATION: 20,
    MAX_TIER: 4,
  },

  DECADES: [
    { level: 1, range: "20–30", minAge: 20, maxAge: 30 },
    { level: 2, range: "30–40", minAge: 30, maxAge: 40 },
    { level: 3, range: "40–50", minAge: 40, maxAge: 50 },
    { level: 4, range: "50–60", minAge: 50, maxAge: 60 },
    { level: 5, range: "60–65", minAge: 60, maxAge: 65 },
  ],

  SCORE: {
    MULTIPLIER_DECAY: 0.5,
    MAX_MULTIPLIER: 5,
    LEVEL_THRESHOLD: 500,
  },

  COLLISION: {
    GRID_COLS: 8,
    GRID_ROWS: 12,
  },

  PARTICLES: {
    EXPLOSION_COUNT: 12,
    LIFETIME: 0.5,
    SPEED: 200,
  },

  TIPS: [
    "Regularne składki to Twoja tarcza przed inflacją.",
    "Inwestycje w edukację poprawiają długoterminowe wyniki.",
    "Zdrowie to kapitał—chroń je, by uniknąć luk w dochodach.",
    "Procent składany jest Twoim sprzymierzeńcem przez dekady.",
    "Dywersyfikacja zmniejsza ryzyko w planowaniu emerytury.",
    "Zacznij wcześnie—czas jest Twoim największym atutem.",
  ],
} as const;

export const ASSETS = {
  SHIP: "/game/ship.svg",
  ENEMY: "/game/asteroid.svg",
  COIN: "/game/coin.svg",
  HEALTH: "/game/health.svg",
  EDUCATION: "/game/education.svg",
  PARTICLE: "/game/particle.png",

  FALLBACK: {
    SHIP: 0x00993f,
    ENEMY: 0xff4444,
    COIN: 0xffd700,
    HEALTH: 0xff69b4,
    EDUCATION: 0x4169e1,
    PARTICLE: 0xffffff,
  },
} as const;

export const AUDIO = {
  ENABLED: true,
  MASTER_VOLUME: 0.5,
  SFX: {
    SHOOT: { volume: 0.3 },
    HIT: { volume: 0.4 },
    PICKUP: { volume: 0.3 },
    GAMEOVER: { volume: 0.5 },
  },
} as const;

export const CONTROLS = {
  KEYBOARD: {
    LEFT: ["ArrowLeft", "KeyA"],
    RIGHT: ["ArrowRight", "KeyD"],
    UP: ["ArrowUp", "KeyW"],
    DOWN: ["ArrowDown", "KeyS"],
    FIRE: ["Space"],
    PAUSE: ["KeyP"],
  },
  TOUCH: {
    DRAG_SENSITIVITY: 1.0,
    FIRE_COOLDOWN: 0.3,
  },
} as const;
