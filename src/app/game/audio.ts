import { sound } from "@pixi/sound";

export class AudioManager {
  private static instance: AudioManager;
  private initialized = false;
  private muted = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async init() {
    if (this.initialized) return;

    try {
      const sounds = [
        { name: "shoot", url: "/game/sounds/shoot.mp3", volume: 0.3 },
        { name: "hit", url: "/game/sounds/hit.mp3", volume: 0.4 },
        { name: "pickup", url: "/game/sounds/pickup.mp3", volume: 0.3 },
        { name: "gameover", url: "/game/sounds/gameover.mp3", volume: 0.5 },
      ];

      for (const snd of sounds) {
        try {
          sound.add(snd.name, {
            url: snd.url,
            preload: true,
            volume: snd.volume,
          });
        } catch (err) {
          console.warn(`Failed to add sound ${snd.name}:`, err);
        }
      }

      this.initialized = true;

      const savedMuteState = localStorage.getItem("zus-game-audio-muted");
      if (savedMuteState === "true") {
        this.muted = true;
      }
    } catch (error) {
      console.warn("Failed to initialize audio:", error);
      this.initialized = true;
    }
  }

  play(soundName: "shoot" | "hit" | "pickup" | "gameover") {
    if (!this.initialized || this.muted) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    try {
      if (sound.exists(soundName)) {
        sound.play(soundName);
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem("zus-game-audio-muted", muted.toString());
  }

  isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.setMuted(this.muted);
    return this.muted;
  }
}

export const audioManager = AudioManager.getInstance();

