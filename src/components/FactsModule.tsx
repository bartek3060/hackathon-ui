"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GreenButton } from "@/components/GreenButton";
import { Button } from "@/components/ui/button";
import { PENSION_FACTS, type Fact } from "@/constants/pension-facts-data";

interface FactsModuleProps {
  trigger: boolean;
  onDismiss?: () => void;
}

const SHOWN_FACTS_KEY = "pension-facts-shown";

const getNextFact = (): Fact | null => {
  if (typeof window === "undefined") return null;

  const shownIds = JSON.parse(
    sessionStorage.getItem(SHOWN_FACTS_KEY) || "[]"
  ) as string[];

  const availableFacts = PENSION_FACTS.filter(
    (fact) => !shownIds.includes(fact.id)
  );

  if (availableFacts.length === 0) {
    sessionStorage.setItem(SHOWN_FACTS_KEY, "[]");
    return PENSION_FACTS[Math.floor(Math.random() * PENSION_FACTS.length)];
  }

  return availableFacts[Math.floor(Math.random() * availableFacts.length)];
};

const markFactAsShown = (factId: string) => {
  if (typeof window === "undefined") return;

  const shownIds = JSON.parse(
    sessionStorage.getItem(SHOWN_FACTS_KEY) || "[]"
  ) as string[];

  if (!shownIds.includes(factId)) {
    shownIds.push(factId);
    sessionStorage.setItem(SHOWN_FACTS_KEY, JSON.stringify(shownIds));
  }
};

export function FactsModule({ trigger, onDismiss }: FactsModuleProps) {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);

  useEffect(() => {
    if (trigger && !currentFact) {
      const fact = getNextFact();
      if (fact) {
        setCurrentFact(fact);
        markFactAsShown(fact.id);
        setTimeout(() => {
          setIsToastVisible(true);
        }, 600);
      }
    }
  }, [trigger, currentFact]);

  const handleClose = useCallback(() => {
    setIsToastVisible(false);
    setTimeout(() => {
      setCurrentFact(null);
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  const handleReadMore = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    handleClose();
  }, [handleClose]);

  if (!currentFact) return null;

  return (
    <>
      <div
        className={`fixed left-8 bottom-8 max-w-md z-40 transition-all duration-500 ease-out ${
          isToastVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0"
        }`}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <Card className="bg-white border border-gray-200 shadow-lg">
          <div className="px-4 py-2.5">
            <div className="flex items-start gap-3 mb-1.5">
              <div
                className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-lg">💡</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Czy wiesz, że...
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentFact.teaser}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-custom-2 focus:ring-offset-2 rounded p-0.5"
                aria-label="Zamknij powiadomienie"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-gray-100">
              <GreenButton
                onClick={handleReadMore}
                className="flex-1 text-xs font-medium h-9"
                type="button"
              >
                Czytaj więcej
              </GreenButton>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 text-xs font-medium h-9"
                type="button"
              >
                Zamknij
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 pr-6">
              {currentFact.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Szczegółowe informacje o fakcie emerytalnym
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {currentFact.body}
              </p>
            </div>

            {currentFact.sourceLabel && currentFact.sourceUrl && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Źródło:{" "}
                  <a
                    href={currentFact.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-custom-2 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-custom-2 focus:ring-offset-2 rounded"
                  >
                    {currentFact.sourceLabel}
                    <span className="sr-only"> (otwiera się w nowym oknie)</span>
                  </a>
                </p>
              </div>
            )}

            {currentFact.tags && currentFact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {currentFact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-custom-2/10 text-custom-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <GreenButton
                onClick={handleDialogClose}
                className="px-6"
                type="button"
              >
                Zamknij
              </GreenButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

