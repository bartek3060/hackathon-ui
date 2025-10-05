"use client";

import { useEffect } from "react";
import { GameCanvas } from "./GameCanvas";
import { GameHUD } from "./GameHUD";
import { LevelUpOverlay } from "./LevelUpOverlay";
import { GameOverModal } from "./GameOverModal";
import { MenuOverlay } from "./MenuOverlay";
import { PausedOverlay } from "./PausedOverlay";
import { useGameStore } from "../store";

export function GameScreen() {
  const { phase, level, start, pause, resume, reset } = useGameStore();

  useEffect(() => {
    reset();

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (phase === "menu" || phase === "gameover") {
            start();
          }
          break;
        case "KeyP":
          e.preventDefault();
          if (phase === "playing") {
            pause();
          } else if (phase === "paused") {
            resume();
          }
          break;
        case "Escape":
          e.preventDefault();
          if (phase === "playing") {
            pause();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      
      if (typeof window !== "undefined") {
        delete (window as any).gameStore;
      }
    };
  }, [phase, start, pause, resume, reset]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GameCanvas />
      <GameHUD />
      <MenuOverlay />
      <PausedOverlay />
      <LevelUpOverlay level={level} />
      <GameOverModal />
    </div>
  );
}

