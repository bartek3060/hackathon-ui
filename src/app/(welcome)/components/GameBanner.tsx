"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Star, Sparkles } from "lucide-react";

export function GameBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative bg-gradient-to-r from-[#00993F]/5 via-[#3F84D2]/5 to-[#00993F]/5 border border-[#00993F]/20 rounded-xl p-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-4 -right-4 w-20 h-20 bg-[#00993F] rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#3F84D2] rounded-full blur-2xl"
        />

        <motion.div
          animate={{
            y: [-2, 2, -2],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-2 right-8"
        >
          <Sparkles className="w-3 h-3 text-[#00993F]" />
        </motion.div>
        <motion.div
          animate={{
            y: [2, -2, 2],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute bottom-2 left-8"
        >
          <Star className="w-3 h-3 text-[#3F84D2]" />
        </motion.div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00993F]/10 rounded-lg">
            <Rocket className="w-4 h-4 text-[#00993F]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 leading-tight">
              ZUS: Obrońca Galaktyki
            </h2>
            <p className="text-[10px] text-gray-600">
              Poznaj emeryturę przez grę
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <Link href="/game">
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#00993F] to-[#007A32] hover:from-[#007A32] hover:to-[#00993F] text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-xs flex items-center gap-1.5"
          >
            <Rocket className="w-3.5 h-3.5" />
            Zagraj teraz
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
