"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimulationFormInterface } from "../simulation-form.schema";

interface Step2WorkPeriodProps {
  control: Control<SimulationFormInterface>;
  errors: FieldErrors<SimulationFormInterface>;
  watchedGender: "male" | "female" | undefined;
}

const RETIREMENT_AGE = {
  male: 65,
  female: 60,
};

export function Step2WorkPeriod({
  control,
  errors,
  watchedGender,
}: Step2WorkPeriodProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="workStart" className="text-base font-medium">
          Rok rozpoczęcia pracy *
        </Label>
        <Controller
          name="workStartYear"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                id="workStart"
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="np. 2020"
                className="h-12"
              />
              {errors.workStartYear && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.workStartYear.message || "Invalid value")}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Wprowadź rok w formacie RRRR (np. 2020)
              </p>
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="workEnd" className="text-base font-medium">
          Planowany rok zakończenia aktywności zawodowej *
        </Label>
        <Controller
          name="workEndYear"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                id="workEnd"
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="np. 2055"
                className="h-12"
              />
              {errors.workEndYear && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.workEndYear.message || "Invalid value")}
                </p>
              )}
              {watchedGender && (
                <p className="text-sm text-gray-500 mt-2">
                  Sugerowany wiek emerytalny: {RETIREMENT_AGE[watchedGender as keyof typeof RETIREMENT_AGE]} lat
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
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
            className="text-blue-600 flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Uwaga dotycząca dat
            </p>
            <p className="text-sm text-blue-700">
              W kalkulacjach przyjmujemy, że rozpoczęcie i zakończenie pracy następuje w styczniu danego roku.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
