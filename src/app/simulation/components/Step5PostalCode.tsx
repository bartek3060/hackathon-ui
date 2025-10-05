"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimulationFormInterface } from "../simulation-form.schema";

interface Step5PostalCodeProps {
  control: Control<SimulationFormInterface>;
  errors: FieldErrors<SimulationFormInterface>;
}

export function Step5PostalCode({ control, errors }: Step5PostalCodeProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl" aria-hidden="true">
            📍
          </span>
          <h2 className="text-xl font-bold text-gray-900">
            Podaj kod pocztowy (opcjonalnie)
          </h2>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          Jeśli chcesz, podaj nam swój kod pocztowy – przyda się nam do analityki i polepszenia sytuacji z emeryturami w Polsce.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Dzięki tym danym możemy lepiej zrozumieć różnice regionalne i tworzyć trafniejsze prognozy.
        </p>
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
              Dlaczego pytamy?
            </p>
            <p className="text-sm text-blue-700">
              Informacje o regionach pomagają nam analizować różnice w sytuacji emerytalnej i dostosowywać nasze prognozy do lokalnych warunków ekonomicznych.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="postalCode" className="text-base font-medium">
          Kod pocztowy
        </Label>
        <Controller
          name="postalCode"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                id="postalCode"
                type="text"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const formatted = value
                    .replace(/\D/g, "")
                    .replace(/^(\d{2})(\d)/, "$1-$2")
                    .substring(0, 6);
                  field.onChange(formatted);
                }}
                placeholder="np. 30-001"
                className="h-12 text-base"
                maxLength={6}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-2">
                  {String(errors.postalCode.message || "Nieprawidłowy format")}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Pole nieobowiązkowe – nie wpływa na wynik symulacji
              </p>
            </div>
          )}
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600 flex-shrink-0 mt-0.5"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <p className="text-xs text-gray-600">
            Twoje dane są przetwarzane zgodnie z RODO i wykorzystywane wyłącznie do celów analitycznych. Kod pocztowy nie pozwala na Twoją identyfikację.
          </p>
        </div>
      </div>
    </div>
  );
}

