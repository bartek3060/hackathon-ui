"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

interface StepProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  title: string;
  description?: string;
  className?: string;
}

export function Stepper({ currentStep, totalSteps, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              <div className="mt-2 text-xs text-center">
                <div className="font-medium text-gray-900">
                  Krok {index + 1}
                </div>
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  index < currentStep ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function Step({
  step,
  isActive,
  isCompleted,
  title,
  description,
  className,
}: StepProps) {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
          isCompleted
            ? "bg-green-500 text-white"
            : isActive
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-500"
        )}
      >
        {isCompleted ? "✓" : step}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
