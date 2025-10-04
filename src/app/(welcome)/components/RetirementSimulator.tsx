"use client";

import { HeroSection } from "./HeroSection";
import { PensionInputForm } from "./PensionInputForm";
import { HeroImage } from "./HeroImage";

export function RetirementSimulator() {
  const handleSubmit = (amount: string) => {
    console.log("Desired amount:", amount);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-2 min-h-screen">
        <div className="bg-white flex items-center justify-center p-12">
          <div className="max-w-xl space-y-8">
            <HeroSection />
            <PensionInputForm onSubmit={handleSubmit} />
          </div>
        </div>
        
        <HeroImage />
      </div>
    </div>
  );
}

