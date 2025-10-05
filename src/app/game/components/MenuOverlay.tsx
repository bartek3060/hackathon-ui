"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "../store";
import { Play, Keyboard, Info } from "lucide-react";
import { GameInfoOverlay } from "./GameInfoOverlay";

export function MenuOverlay() {
  const { phase, start } = useGameStore();
  const [showInfo, setShowInfo] = useState(false);

  if (phase !== "menu") return null;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="pointer-events-auto space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold text-[#00993F] drop-shadow-lg">
              ZUS: Obrońca Galaktyki
            </h1>
            <p className="text-2xl text-white/90 drop-shadow">
              Zabezpiecz swoją przyszłość emerytalną
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={start}
                size="lg"
                className="gap-2 bg-[#00993F] px-12 py-6 text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#008535] focus-visible:ring-2 focus-visible:ring-[#00993F] focus-visible:ring-offset-4"
              >
                <Play className="h-6 w-6" />
                Rozpocznij Grę
              </Button>

              <Button
                onClick={() => setShowInfo(true)}
                size="lg"
                variant="outline"
                className="gap-2 border-[#00993F] bg-black/40 px-8 py-6 text-xl font-bold text-[#00993F] shadow-2xl backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#00993F] hover:text-white focus-visible:ring-2 focus-visible:ring-[#00993F] focus-visible:ring-offset-4"
              >
                <Info className="h-6 w-6" />
                Jak grać?
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
              <Keyboard className="h-4 w-4" />
              <span>lub naciśnij SPACJĘ aby rozpocząć</span>
            </div>
          </div>

        <div className="space-y-3 rounded-lg py-6">
          <h3 className="text-lg font-semibold text-white">Sterowanie</h3>
          <div className="space-y-2 text-white/80">
            <div className="flex items-center justify-center gap-2">
              <kbd className="rounded bg-white/10 px-3 py-1 font-mono text-sm">←</kbd>
              <kbd className="rounded bg-white/10 px-3 py-1 font-mono text-sm">→</kbd>
              <span>lub</span>
              <kbd className="rounded bg-white/10 px-3 py-1 font-mono text-sm">A</kbd>
              <kbd className="rounded bg-white/10 px-3 py-1 font-mono text-sm">D</kbd>
              <span className="ml-2">Ruch</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <kbd className="rounded bg-white/10 px-3 py-1 font-mono text-sm">SPACJA</kbd>
              <span className="ml-2">Strzał</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <kbd className="rounded bg-white/10 px-3 py-1 font-mono text-sm">P</kbd>
              <span className="ml-2">Pauza</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <GameInfoOverlay isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}

