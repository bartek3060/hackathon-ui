"use client";

import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimulationFormInterface } from "../simulation-form.schema";

interface Step4ReviewProps {
  control: Control<SimulationFormInterface>;
}

export function Step4Review({ control }: Step4ReviewProps) {
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

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
            className="text-green-600 flex-shrink-0 mt-0.5"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>
            <p className="text-sm font-medium text-green-900 mb-1">
              Gotowe do zapisania
            </p>
            <p className="text-sm text-green-700">
              Kliknij „Zapisz i kontynuuj" poniżej, aby zapisać dane i rozpocząć kalkulację emerytury.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
