"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGameStore } from "../store";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

export function GameOverModal() {
  const { phase, score, elapsed, totalShots, totalHits, enemiesDestroyed, pickupsCollected, reset } = useGameStore();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const isOpen = phase === "gameover";
  const accuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;
  const survivalTime = Math.floor(elapsed);
  const minutes = Math.floor(survivalTime / 60);
  const seconds = survivalTime % 60;
  const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const handlePlayAgain = () => {
    reset();
  };

  const handleSubmitScore = () => {
    if (playerName.trim()) {
      setPlayerName("");
      setShowLeaderboard(false);
      reset();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-red-600">
            Koniec Gry
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Twoja droga do emerytury dobiegła końca
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-[#00993F]/10 p-4">
              <Trophy className="h-6 w-6 text-[#00993F]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00993F]">{score}</div>
                <div className="text-xs text-muted-foreground">Wynik Końcowy</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-blue-50 p-4">
              <Clock className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{timeString}</div>
                <div className="text-xs text-muted-foreground">Czas Przetrwania</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-orange-50 p-4">
              <Target className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Celność</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-purple-50 p-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{enemiesDestroyed}</div>
                <div className="text-xs text-muted-foreground">Wrogowie</div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <div>Strzałów: {totalShots} • Trafień: {totalHits}</div>
            <div>Zebranych bonusów: {pickupsCollected}</div>
          </div>

          {showLeaderboard && (
            <div className="space-y-3 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="player-name">Twoje Imię</Label>
                <Input
                  id="player-name"
                  placeholder="Wpisz swoje imię"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && playerName.trim()) {
                      handleSubmitScore();
                    }
                  }}
                  maxLength={20}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim()}
                  className="flex-1 bg-[#00993F] hover:bg-[#008535]"
                >
                  Wyślij Wynik
                </Button>
                <Button
                  onClick={() => setShowLeaderboard(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Anuluj
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {!showLeaderboard && (
            <>
              <Button
                onClick={handlePlayAgain}
                className="w-full bg-[#00993F] hover:bg-[#008535]"
                size="lg"
              >
                Zagraj Ponownie
              </Button>
              <Button
                onClick={() => setShowLeaderboard(true)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Wyślij do Rankingu
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

