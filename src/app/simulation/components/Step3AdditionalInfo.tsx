"use client";

import { Controller, Control, FieldErrors, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const includeZusFields = useWatch({
    control,
    name: "includeZusFields",
  }) as boolean;
  const includeSickLeave = useWatch({
    control,
    name: "includeSickLeave",
  }) as boolean;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Controller
          name="includeZusFields"
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zusFields"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="zusFields" className="text-base font-medium">
                  Chcesz podać wysokość zgromadzonych środków ZUS
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Możesz podać wysokość środków na koncie i subkoncie ZUS, jeśli
                ją znasz
              </p>
            </div>
          )}
        />
      </div>

      {includeZusFields && (
        <>
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
                      {String(
                        errors.zusAccountFunds.message || "Invalid value"
                      )}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Jeśli nie znasz tej kwoty, zostanie oszacowana na podstawie
                    wynagrodzenia
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
                      {String(
                        errors.zusSubAccountFunds.message || "Invalid value"
                      )}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </>
      )}

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
              <p className="text-sm text-muted-foreground ml-6">
                Symulacja uwzględni średnią długość zwolnień lekarskich w ciągu
                życia
              </p>
            </div>
          )}
        />
      </div>

      {watchedGender && includeSickLeave && (
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p>
                <strong>Średnie zwolnienia lekarskie w Polsce:</strong>
              </p>
              <p>• Mężczyźni: {SICK_LEAVE_DATA.male} dni rocznie</p>
              <p>• Kobiety: {SICK_LEAVE_DATA.female} dni rocznie</p>
              <p className="text-sm text-muted-foreground mt-2">
                Ta informacja zostanie uwzględniona w obliczeniach emerytury
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
