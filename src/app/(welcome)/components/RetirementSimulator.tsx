"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "./HeroSection";
import { PensionInputForm } from "./PensionInputForm";
import { HeroImage } from "./HeroImage";
import { PensionGroupsChart } from "./PensionGroupsChart";
import { usePensionGroups } from "@/hooks/queries/usePensionGroups";
import { FactsModule } from "@/components/FactsModule";

type ViewState = "hero" | "chart";

export function RetirementSimulator() {
  const [viewState, setViewState] = useState<ViewState>("hero");
  const [userAmount, setUserAmount] = useState<number>(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const { data: pensionData, isLoading } = usePensionGroups(shouldFetch);

  const handleSubmit = (amount: string) => {
    setUserAmount(parseInt(amount));
    setShouldFetch(true);
    setViewState("chart");
    setShowFact(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-8 left-8 z-10">
        <a 
          href="https://www.zus.pl/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <img 
            src="/logo.svg" 
            alt="ZUS Logo" 
            className="h-12 w-auto"
          />
        </a>
      </div>
      
      <div className="grid grid-cols-2 min-h-screen">
        <div className="bg-white flex items-center justify-center p-12">
          <div className="max-w-xl space-y-8">
            <HeroSection />
            <PensionInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
        
        <div className="relative h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {viewState === "chart" && pensionData ? (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 p-8 flex items-center justify-center"
              >
                <div className="w-full h-full bg-gray-50 rounded-3xl p-6 flex items-center justify-center">
                  <div className="w-full max-w-full">
                    <PensionGroupsChart
                      pensionGroups={pensionData.pensionGroups}
                      userAmount={userAmount}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <HeroImage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Facts Module - shows on left side when chart appears */}
      <FactsModule 
        trigger={showFact && viewState === "chart"} 
        onDismiss={() => setShowFact(false)}
      />
    </div>
  );
}

