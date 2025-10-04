"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
              <p className="text-sm text-muted-foreground">
                Rok odnosi się do stycznia danego roku
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
              <p className="text-sm text-muted-foreground">
                Automatycznie ustawiony na rok osiągnięcia wieku emerytalnego (
                {RETIREMENT_AGE[watchedGender as keyof typeof RETIREMENT_AGE]}{" "}
                lat)
              </p>
            </div>
          )}
        />
      </div>

      <Alert>
        <AlertDescription>
          <strong>Informacja:</strong> Rok rozpoczęcia i zakończenia pracy
          zawsze odnosi się do stycznia danego roku.
        </AlertDescription>
      </Alert>
    </div>
  );
}
