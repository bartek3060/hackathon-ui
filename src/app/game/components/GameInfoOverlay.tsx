"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameInfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameInfoOverlay({ isOpen, onClose }: GameInfoOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-[#00993F] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00993F] via-[#00B84A] to-[#00993F]" />
        
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Przewodnik po grze</h2>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#00993F] mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-5 bg-[#00993F] rounded"></span>
                Twój statek
              </h3>
              <div className="bg-black/40 rounded-lg border border-[#00993F]/30 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#00993F]/10 rounded-lg flex items-center justify-center border border-[#00993F]/30">
                    <img src="/game/ship.svg" alt="Ship" className="w-12 h-12" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#00993F] mb-1">Statek ZUS</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">
                      Twój zielony statek reprezentuje Twoją podróż emerytalną. Poruszaj się w lewo i prawo, 
                      strzelaj do zagrożeń i zbieraj korzyści emerytalne!
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="px-2 py-1 bg-[#00993F]/20 rounded">3 życia na start</span>
                      <span className="px-2 py-1 bg-[#00993F]/20 rounded">2s nieśmiertelności po trafieniu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#00993F] mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-5 bg-[#00993F] rounded"></span>
                Wrogowie
              </h3>
              <div className="bg-black/40 rounded-lg border border-red-500/30 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/30">
                    <img src="/game/asteroid.svg" alt="Asteroid" className="w-12 h-12" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-red-400 mb-1">Asteroidy</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">
                      Niebezpieczne meteoryty, które zagrażają Twojej misji emerytalnej. 
                      Zestrzel je, aby zdobyć punkty i chronić swoją przyszłość!
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="px-2 py-1 bg-red-500/20 rounded">+50 punktów</span>
                      <span className="px-2 py-1 bg-red-500/20 rounded">-1 życie przy kolizji</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#00993F] mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-5 bg-[#00993F] rounded"></span>
                Przedmioty do zbierania
              </h3>
              <div className="space-y-3">
                <div className="bg-black/40 rounded-lg border border-yellow-500/30 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/30">
                      <img src="/game/coin.svg" alt="Coin" className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-yellow-400 mb-1">Złotówki</h4>
                      <p className="text-white/80 text-sm leading-relaxed mb-2">
                        Podstawowa waluta emerytalna. Zbieraj monety, aby zwiększyć swoje oszczędności!
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="px-2 py-1 bg-yellow-500/20 rounded">+100 punktów</span>
                        <span className="px-2 py-1 bg-yellow-500/20 rounded">60% szans na pojawienie się</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg border border-pink-500/30 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-pink-500/10 rounded-lg flex items-center justify-center border border-pink-500/30">
                      <img src="/game/health.svg" alt="Health" className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-pink-400 mb-1">Zdrowie</h4>
                      <p className="text-white/80 text-sm leading-relaxed mb-2">
                        Opieka zdrowotna jest kluczowa dla długiego życia. Odzyskaj jedno życie!
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="px-2 py-1 bg-pink-500/20 rounded">+1 życie</span>
                        <span className="px-2 py-1 bg-pink-500/20 rounded">Maks. 5 żyć</span>
                        <span className="px-2 py-1 bg-pink-500/20 rounded">25% szans</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg border border-blue-500/30 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <img src="/game/education.svg" alt="Education" className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-blue-400 mb-1">Edukacja</h4>
                      <p className="text-white/80 text-sm leading-relaxed mb-2">
                        Wiedza to potęga! Zwiększa mnożnik punktów, pomagając szybciej osiągać cele emerytalne.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="px-2 py-1 bg-blue-500/20 rounded">+0.5× mnożnik</span>
                        <span className="px-2 py-1 bg-blue-500/20 rounded">Maks. 5×</span>
                        <span className="px-2 py-1 bg-blue-500/20 rounded">15% szans</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              onClick={onClose}
              size="lg"
              className="w-full bg-[#00993F] hover:bg-[#008535] text-white font-bold"
            >
              Zrozumiałem, zacznijmy grać!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

