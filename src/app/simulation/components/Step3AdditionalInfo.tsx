"use client";

import { Controller, Control, FieldErrors, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SimulationFormInterface } from "../simulation-form.schema";

interface Step3AdditionalInfoProps {
  control: Control<SimulationFormInterface>;
  errors: FieldErrors<SimulationFormInterface>;
  formatCurrency: (value: string) => string;
}

const SICK_LEAVE_DATA = {
  male: 12, // days per year
  female: 18, // days per year
};

export function Step3AdditionalInfo({
  control,
  errors,
  formatCurrency,
}: Step3AdditionalInfoProps) {
  const watchedGender = useWatch({ control, name: "gender" }) as
    | "male"
    | "female"
    | undefined;
  const includeSickLeave = useWatch({
    control,
    name: "includeSickLeave",
  }) as boolean;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="zusAccount" className="text-base font-medium">
          Wysokość zgromadzonych środków na koncie w ZUS (PLN)
        </Label>
        <Controller
          name="zusAccountFunds"
          control={control}
          render={({ field }) => (
            <div>
              <div className="relative">
                <Input
                  id="zusAccount"
                  type="text"
                  value={formatCurrency((field.value || 0).toString())}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value ? parseInt(value) : 0);
                  }}
                  placeholder="0"
                  className="h-12 pr-20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  PLN
                </div>
              </div>
              {errors.zusAccountFunds && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.zusAccountFunds.message || "Invalid value")}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Pole opcjonalne – zostanie oszacowane automatycznie
              </p>
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="zusSubAccount" className="text-base font-medium">
          Wysokość zgromadzonych środków na subkoncie w ZUS (PLN)
        </Label>
        <Controller
          name="zusSubAccountFunds"
          control={control}
          render={({ field }) => (
            <div>
              <div className="relative">
                <Input
                  id="zusSubAccount"
                  type="text"
                  value={formatCurrency((field.value || 0).toString())}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value ? parseInt(value) : 0);
                  }}
                  placeholder="0"
                  className="h-12 pr-20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  PLN
                </div>
              </div>
              {errors.zusSubAccountFunds && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.zusSubAccountFunds.message || "Invalid value")}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <Controller
          name="includeSickLeave"
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sickLeave"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="sickLeave" className="text-base font-medium">
                  Uwzględniaj możliwość zwolnień lekarskich
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6 mt-1">
                Symulacja uwzględni średnią długość zwolnień w okresie aktywności zawodowej
              </p>
            </div>
          )}
        />
      </div>

      {watchedGender && includeSickLeave && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
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
                className="text-purple-600"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                Średnie zwolnienia lekarskie w Polsce
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                  <p className="text-xs text-purple-700 mb-1">Mężczyźni</p>
                  <p className="text-lg font-bold text-purple-900">
                    {SICK_LEAVE_DATA.male} dni
                  </p>
                  <p className="text-xs text-purple-600">rocznie</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                  <p className="text-xs text-purple-700 mb-1">Kobiety</p>
                  <p className="text-lg font-bold text-purple-900">
                    {SICK_LEAVE_DATA.female} dni
                  </p>
                  <p className="text-xs text-purple-600">rocznie</p>
                </div>
              </div>
              <p className="text-xs text-purple-700">
                ✓ Dane zostaną uwzględnione w kalkulacji wysokości emerytury
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
