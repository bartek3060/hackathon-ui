"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { GAME_CONFIG } from "../constants";
import { TrendingUp } from "lucide-react";
import { useGameStore } from "../store";

interface LevelUpOverlayProps {
  level: number;
}

export function LevelUpOverlay({ level }: LevelUpOverlayProps) {
  const phase = useGameStore((state) => state.phase);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentTip, setCurrentTip] = useState("");

  useEffect(() => {
    if (level !== currentLevel && phase === "playing") {
      const randomTip = GAME_CONFIG.TIPS[Math.floor(Math.random() * GAME_CONFIG.TIPS.length)];
      setCurrentTip(randomTip);
      setShowOverlay(true);
      setCurrentLevel(level);

      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [level, currentLevel, phase]);

  useEffect(() => {
    if (phase === "gameover" || phase === "paused") {
      setShowOverlay(false);
    }
  }, [phase]);

  const decade = GAME_CONFIG.DECADES.find(d => d.level === level);

  if (!decade || phase !== "playing") return null;

  return (
    <AnimatePresence>
      {showOverlay && (
        <MotionConfig reducedMotion="user">
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-none absolute top-20 right-6 z-50 max-w-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="relative bg-black/90 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden border-l-4 border-r border-b border-[#00993F]">
              <div className="flex items-center gap-3 bg-gradient-to-r from-[#00993F] to-[#007A32] px-4 py-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white/80 uppercase tracking-wide">
                    Dekada {decade.range}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Poziom {level}
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-black/40">
                <p className="text-sm text-white/90 leading-relaxed">
                  {currentTip}
                </p>
              </div>
            </div>
          </motion.div>
        </MotionConfig>
      )}
    </AnimatePresence>
  );
}

