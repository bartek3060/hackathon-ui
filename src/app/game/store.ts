import { create } from "zustand";
import { audioManager } from "./audio";

export type GamePhase = "menu" | "playing" | "paused" | "gameover";

export type PickupType = "coin" | "health" | "education";

interface GameState {
  phase: GamePhase;

  score: number;
  lives: number;
  level: number;
  multiplier: number;
  elapsed: number;

  totalShots: number;
  totalHits: number;
  enemiesDestroyed: number;
  pickupsCollected: number;

  audioEnabled: boolean;
  autoFire: boolean;

  highScore: number;

  start: () => void;
  pause: () => void;
  resume: () => void;
  gameover: () => void;
  reset: () => void;

  addScore: (points: number) => void;
  loseLife: () => void;
  gainLife: () => void;
  updateMultiplier: (value: number) => void;
  updateElapsed: (seconds: number) => void;
  incrementShots: () => void;
  incrementHits: () => void;
  incrementEnemiesDestroyed: () => void;
  incrementPickups: () => void;

  toggleAudio: () => void;
  toggleAutoFire: () => void;

  updateHighScore: (score: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "menu",
  score: 0,
  lives: 3,
  level: 1,
  multiplier: 1,
  elapsed: 0,
  totalShots: 0,
  totalHits: 0,
  enemiesDestroyed: 0,
  pickupsCollected: 0,
  audioEnabled: true,
  autoFire: false,
  highScore: 0,

  start: () => {
    set({
      phase: "playing",
      score: 0,
      lives: 3,
      level: 1,
      multiplier: 1,
      elapsed: 0,
      totalShots: 0,
      totalHits: 0,
      enemiesDestroyed: 0,
      pickupsCollected: 0,
    });
  },

  pause: () => {
    const { phase } = get();
    if (phase === "playing") {
      set({ phase: "paused" });
    }
  },

  resume: () => {
    const { phase } = get();
    if (phase === "paused") {
      set({ phase: "playing" });
    }
  },

  gameover: () => {
    const { score, highScore, lives } = get();
    audioManager.play("gameover");
    set({
      phase: "gameover",
      highScore: Math.max(score, highScore),
    });
  },

  reset: () =>
    set({
      phase: "menu",
      score: 0,
      lives: 3,
      level: 1,
      multiplier: 1,
      elapsed: 0,
      totalShots: 0,
      totalHits: 0,
      enemiesDestroyed: 0,
      pickupsCollected: 0,
    }),

  addScore: (points: number) => {
    const { score, multiplier, phase, lives } = get();
    const newScore = score + Math.floor(points * multiplier);
    set({
      score: newScore,
    });
  },

  loseLife: () => {
    const { lives, phase } = get();
    const newLives = Math.max(0, lives - 1);
    set({ lives: newLives });
    if (newLives === 0) {
      get().gameover();
    }
  },

  gainLife: () => {
    const { lives } = get();
    set({ lives: Math.min(5, lives + 1) });
  },

  updateMultiplier: (value: number) => {
    set({ multiplier: Math.min(5, Math.max(1, value)) });
  },

  updateElapsed: (seconds: number) => {
    const newLevel = Math.min(Math.floor(seconds / 20) + 1, 5);
    set({ elapsed: seconds, level: newLevel });
  },

  incrementShots: () => {
    const { totalShots } = get();
    set({ totalShots: totalShots + 1 });
  },

  incrementHits: () => {
    const { totalHits } = get();
    set({ totalHits: totalHits + 1 });
  },

  incrementEnemiesDestroyed: () => {
    const { enemiesDestroyed } = get();
    set({ enemiesDestroyed: enemiesDestroyed + 1 });
  },

  incrementPickups: () => {
    const { pickupsCollected } = get();
    set({ pickupsCollected: pickupsCollected + 1 });
  },

  toggleAudio: () => {
    const { audioEnabled } = get();
    set({ audioEnabled: !audioEnabled });
  },

  toggleAutoFire: () => {
    const { autoFire } = get();
    set({ autoFire: !autoFire });
  },

  updateHighScore: (score: number) => {
    const { highScore } = get();
    if (score > highScore) {
      set({ highScore: score });
    }
  },
}));
