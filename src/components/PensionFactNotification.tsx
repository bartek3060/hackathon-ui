"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getRandomPensionFact } from "@/constants/pension-facts";

export function PensionFactNotification() {
  const [fact, setFact] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showFact = () => {
      setFact(getRandomPensionFact());
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    };

    const initialDelay = setTimeout(showFact, 3000);

    const interval = setInterval(showFact, 15000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  if (!fact) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 max-w-md z-50 transition-all duration-500 ease-in-out ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0"
      }`}
    >
      <Card className="bg-custom-2 border-custom-2 shadow-2xl">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white mb-1">
                Czy wiesz, że...
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                {fact}
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
              aria-label="Zamknij"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

