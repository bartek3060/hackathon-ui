"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "../store";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { audioManager } from "../audio";

export function GameHUD() {
  const { phase, score, lives, level, multiplier, pause, resume } =
    useGameStore();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioManager.init().then(() => {
      setIsMuted(audioManager.isMuted());
    });
  }, []);

  if (phase === "menu" || phase === "gameover") {
    return null;
  }

  const handlePauseResume = () => {
    if (phase === "playing") {
      pause();
    } else if (phase === "paused") {
      resume();
    }
  };

  const handleToggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col">
      <div className="pointer-events-auto flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 via-black/60 to-transparent px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white/60">Wynik</span>
            <span className="text-2xl font-bold text-white tabular-nums">
              {score}
            </span>
          </div>

          <div className="h-10 w-px bg-white/20" />

          <div className="flex flex-col">
            <span className="text-xs font-medium text-white/60">Życia</span>
            <span className="text-xl font-bold text-red-400">
              {"♥".repeat(Math.max(0, lives))}
            </span>
          </div>

          <div className="h-10 w-px bg-white/20" />

          <div className="flex flex-col">
            <span className="text-xs font-medium text-white/60">Poziom</span>
            <span className="text-2xl font-bold text-white tabular-nums">
              {level}
            </span>
          </div>

          <div className="h-10 w-px bg-white/20" />

          <div className="flex flex-col">
            <span className="text-xs font-medium text-white/60">Mnożnik</span>
            <span className="text-2xl font-bold text-[#00993F] tabular-nums">
              ×{multiplier.toFixed(1)}
            </span>
          </div>
        </div>

        {phase === "paused" && (
          <div className="rounded-md bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300 backdrop-blur-sm">
            Pauza
          </div>
        )}
      </div>

      <div className="pointer-events-auto mt-auto flex justify-end gap-3 p-6">
        <Button
          onClick={handleToggleMute}
          size="lg"
          variant="outline"
          className="gap-2 border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          title={isMuted ? "Włącz dźwięk" : "Wycisz"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        <Button
          onClick={handlePauseResume}
          size="lg"
          className="gap-2 bg-[#00993F] text-white shadow-lg transition-all hover:bg-[#008535] focus-visible:ring-2 focus-visible:ring-[#00993F] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {phase === "paused" ? (
            <>
              <Play className="h-5 w-5" />
              Wznów
            </>
          ) : (
            <>
              <Pause className="h-5 w-5" />
              Pauza
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
