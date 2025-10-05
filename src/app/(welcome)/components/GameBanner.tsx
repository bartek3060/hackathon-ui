"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Star } from "lucide-react";

export function GameBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 overflow-hidden shadow-sm"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-2 right-2 w-8 h-8 opacity-10">
          <img
            src="/game/ship.svg"
            alt="Space ship"
            className="w-full h-full"
          />
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 opacity-10">
          <img src="/game/coin.svg" alt="Coin" className="w-full h-full" />
        </div>

        {/* Subtle floating star */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-3 right-3"
        >
          <Star className="w-3 h-3 text-gray-400 opacity-40" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[rgb(0,153,63)]" />
          <h2 className="text-sm font-semibold text-gray-900">
            ZUS Space Adventure
          </h2>
        </div>

        <p className="text-xs text-gray-600 flex-1">
          Poznaj emeryturę przez grę!
        </p>

        <Link href="/game">
          <Button
            size="sm"
            className="bg-[rgb(0,153,63)] hover:bg-[rgb(0,133,53)] text-white font-medium px-3 py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-xs"
          >
            <Rocket className="w-3 h-3 mr-1" />
            Graj
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
