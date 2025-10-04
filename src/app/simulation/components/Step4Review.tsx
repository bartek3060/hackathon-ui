"use client";

import { Control, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimulationFormInterface } from "../simulation-form.schema";

interface Step4ReviewProps {
  control: Control<SimulationFormInterface>;
  calculateProjection: (data: SimulationFormInterface) => Promise<void>;
  isCalculating: boolean;
}

export function Step4Review({
  control,
  calculateProjection,
  isCalculating,
}: Step4ReviewProps) {
  const formData = useWatch({ control }) as SimulationFormInterface;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Podsumowanie danych</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Dane podstawowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Wiek:</span>
                <span className="text-sm font-medium">{formData.age} lat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Płeć:</span>
                <span className="text-sm font-medium">
                  {formData.gender === "male" ? "Mężczyzna" : "Kobieta"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Wynagrodzenie:
                </span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("pl-PL").format(
                    formData.grossSalary || 0
                  )}{" "}
                  PLN
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Okres pracy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Rozpoczęcie:
                </span>
                <span className="text-sm font-medium">
                  {formData.workStartYear || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Zakończenie:
                </span>
                <span className="text-sm font-medium">
                  {formData.workEndYear || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Lata pracy:
                </span>
                <span className="text-sm font-medium">
                  {(formData.workEndYear || 0) - (formData.workStartYear || 0)}{" "}
                  lat
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {(formData.zusAccountFunds ||
          formData.zusSubAccountFunds ||
          formData.includeSickLeave) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Dodatkowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!!formData.zusAccountFunds && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Konto ZUS:
                  </span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat("pl-PL").format(
                      formData.zusAccountFunds
                    )}{" "}
                    PLN
                  </span>
                </div>
              )}
              {!!formData.zusSubAccountFunds && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subkonto ZUS:
                  </span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat("pl-PL").format(
                      formData.zusSubAccountFunds
                    )}{" "}
                    PLN
                  </span>
                </div>
              )}
              {formData.includeSickLeave && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Zwolnienia lekarskie:
                  </span>
                  <Badge variant="secondary">Uwzględnione</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Button
        onClick={() => {
          // Pass the form data directly - zod will handle validation and default values
          calculateProjection(formData);
        }}
        disabled={isCalculating}
        className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isCalculating
          ? "Obliczanie..."
          : "Zaprognozuj moją przyszłą emeryturę"}
      </Button>
    </div>
  );
}
