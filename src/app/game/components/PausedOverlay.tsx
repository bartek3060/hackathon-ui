"use client";

import { Button } from "@/components/ui/button";
import { useGameStore } from "../store";
import { Play } from "lucide-react";

export function PausedOverlay() {
  const { phase, resume } = useGameStore();

  if (phase !== "paused") return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="pointer-events-auto space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-7xl font-bold text-[#00993F] drop-shadow-lg">
            Pauza
          </h2>
          <p className="text-xl text-white/90 drop-shadow">
            Gra wstrzymana
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={resume}
            size="lg"
            className="gap-2 bg-[#00993F] px-12 py-6 text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#008535] focus-visible:ring-2 focus-visible:ring-[#00993F] focus-visible:ring-offset-4"
          >
            <Play className="h-6 w-6" />
            Wznów
          </Button>

          <div className="text-sm text-white/70">
            lub naciśnij <kbd className="rounded bg-white/10 px-2 py-1 font-mono">P</kbd> aby wznowić
          </div>
        </div>
      </div>
    </div>
  );
}

