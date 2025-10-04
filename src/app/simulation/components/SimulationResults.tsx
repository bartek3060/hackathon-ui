"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimulationProjectionResult {
  monthlyPension: number;
  yearlyPension: number;
  workYears: number;
  avgSalary: number;
  sickLeaveReduction: number;
  sickLeaveDays: number;
}

interface SimulationResultsProps {
  projectionResult: SimulationProjectionResult | null;
}

export function SimulationResults({
  projectionResult,
}: SimulationResultsProps) {
  if (!projectionResult) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Prognoza emerytury</CardTitle>
        <CardDescription>
          Wyniki obliczeń na podstawie wprowadzonych danych
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {new Intl.NumberFormat("pl-PL").format(
                projectionResult.monthlyPension
              )}{" "}
              PLN
            </div>
            <div className="text-sm text-muted-foreground">
              Miesięczna emerytura
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {new Intl.NumberFormat("pl-PL").format(
                projectionResult.yearlyPension
              )}{" "}
              PLN
            </div>
            <div className="text-sm text-muted-foreground">
              Roczna emerytura
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {projectionResult.workYears} lat
            </div>
            <div className="text-sm text-muted-foreground">Lata pracy</div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Szczegóły obliczeń</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Średnie wynagrodzenie:
                </span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("pl-PL").format(
                    projectionResult.avgSalary
                  )}{" "}
                  PLN
                </span>
              </div>
              {projectionResult.sickLeaveReduction > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Redukcja za zwolnienia:
                    </span>
                    <span className="text-sm font-medium">
                      {projectionResult.sickLeaveReduction}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Średnie dni zwolnień rocznie:
                    </span>
                    <span className="text-sm font-medium">
                      {projectionResult.sickLeaveDays} dni
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Uwaga:</strong> To jest uproszczona prognoza. Rzeczywista
              wysokość emerytury może się różnić w zależności od zmian w
              przepisach, inflacji i innych czynników.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
