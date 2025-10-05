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
  const { level, reset } = useGameStore();

  useEffect(() => {
    reset();

    const handleKeyDown = (e: KeyboardEvent) => {
      const { phase, start, pause, resume } = useGameStore.getState();
      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (phase === "menu" || phase === "gameover") {
            start();
          }
          break;
        case "KeyP":
        case "Escape":
          e.preventDefault();
          if (phase === "playing") {
            pause();
          } else if (phase === "paused") {
            resume();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reset]);

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

