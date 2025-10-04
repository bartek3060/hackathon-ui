"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimulationFormInterface } from "../simulation-form.schema";

interface Step1BasicInfoProps {
  control: Control<SimulationFormInterface>;
  errors: FieldErrors<SimulationFormInterface>;
  formatCurrency: (value: string) => string;
}

export function Step1BasicInfo({
  control,
  errors,
  formatCurrency,
}: Step1BasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="age" className="text-base font-medium">
          Wiek *
        </Label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                id="age"
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="Wpisz swój wiek"
                className="h-12"
              />
              {errors.age && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.age.message || "Invalid value")}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Płeć *</Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Wybierz płeć" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Mężczyzna</SelectItem>
                  <SelectItem value="female">Kobieta</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.gender.message || "Invalid value")}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="salary" className="text-base font-medium">
          Wysokość wynagrodzenia brutto (PLN) *
        </Label>
        <Controller
          name="grossSalary"
          control={control}
          render={({ field }) => (
            <div>
              <div className="relative">
                <Input
                  id="salary"
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
              {errors.grossSalary && (
                <p className="text-sm text-red-500 mt-1">
                  {String(errors.grossSalary.message || "Invalid value")}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
