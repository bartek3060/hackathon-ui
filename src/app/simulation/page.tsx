"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Stepper } from "@/components/ui/stepper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSendEvent } from "@/hooks/mutations/useSendEvent";
import { AppEventType } from "@/enums/app-event-types.enum";
import { getSessionId } from "@/lib/session";

interface SimulationData {
  // Required fields
  age: number;
  gender: "male" | "female";
  grossSalary: number;
  workStartYear: number;
  workEndYear: number;

  // Optional fields
  zusAccountFunds?: number;
  zusSubAccountFunds?: number;

  // Options
  includeSickLeave: boolean;
}

interface SalaryIndexingData {
  year: number;
  indexation: number;
}

// Average salary growth data (simplified - in real app this would come from NBP/GUS API)
const SALARY_GROWTH_DATA: SalaryIndexingData[] = [
  { year: 2020, indexation: 1.05 },
  { year: 2021, indexation: 1.08 },
  { year: 2022, indexation: 1.12 },
  { year: 2023, indexation: 1.1 },
  { year: 2024, indexation: 1.07 },
  { year: 2025, indexation: 1.06 },
  { year: 2026, indexation: 1.05 },
  { year: 2027, indexation: 1.04 },
  { year: 2028, indexation: 1.03 },
  { year: 2029, indexation: 1.03 },
];

// Retirement ages in Poland
const RETIREMENT_AGE = {
  male: 65,
  female: 60,
};

// Average sick leave days per year (simplified data)
const SICK_LEAVE_DATA = {
  male: 12, // days per year
  female: 18, // days per year
};

export default function SimulationPage() {
  const { mutate } = useSendEvent();
  const [currentStep, setCurrentStep] = useState(1);
  const [simulationData, setSimulationData] = useState<SimulationData>({
    age: 0,
    gender: "male",
    grossSalary: 0,
    workStartYear: new Date().getFullYear(),
    workEndYear: 0,
    includeSickLeave: false,
  });
  const [projectionResult, setProjectionResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
    mutate({
      eventType: AppEventType.ENTER_PAGE,
      sessionId: getSessionId(),
    });
  }, [mutate]);

  // Auto-calculate retirement year based on age and gender
  useEffect(() => {
    if (simulationData.age > 0 && simulationData.gender) {
      const retirementAge = RETIREMENT_AGE[simulationData.gender];
      const currentYear = new Date().getFullYear();
      const yearsToRetirement = retirementAge - simulationData.age;
      const retirementYear = currentYear + yearsToRetirement;

      setSimulationData((prev) => ({
        ...prev,
        workEndYear: retirementYear,
      }));
    }
  }, [simulationData.age, simulationData.gender]);

  const handleInputChange = (field: keyof SimulationData, value: any) => {
    setSimulationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("pl-PL").format(parseInt(numbers));
  };

  const handleCurrencyChange = (
    field: keyof SimulationData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    handleInputChange(field, value ? parseInt(value) : 0);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          simulationData.age > 0 &&
          simulationData.gender &&
          simulationData.grossSalary > 0
        );
      case 2:
        return (
          simulationData.workStartYear > 0 && simulationData.workEndYear > 0
        );
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateProjection = async () => {
    setIsCalculating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate projected pension (simplified calculation)
    const workYears = simulationData.workEndYear - simulationData.workStartYear;
    const avgSalary = calculateAverageSalary();
    const sickLeaveReduction = simulationData.includeSickLeave
      ? calculateSickLeaveReduction()
      : 0;

    // Simplified pension calculation (this would be more complex in reality)
    const basePension = (avgSalary * 0.24 * workYears) / 12; // 24% contribution rate
    const finalPension = basePension * (1 - sickLeaveReduction);

    setProjectionResult({
      monthlyPension: Math.round(finalPension),
      yearlyPension: Math.round(finalPension * 12),
      workYears,
      avgSalary: Math.round(avgSalary),
      sickLeaveReduction: Math.round(sickLeaveReduction * 100),
      sickLeaveDays: simulationData.includeSickLeave
        ? simulationData.gender === "male"
          ? SICK_LEAVE_DATA.male
          : SICK_LEAVE_DATA.female
        : 0,
    });

    setIsCalculating(false);
  };

  const calculateAverageSalary = (): number => {
    let currentSalary = simulationData.grossSalary;
    let totalSalary = 0;

    for (
      let year = simulationData.workStartYear;
      year < simulationData.workEndYear;
      year++
    ) {
      totalSalary += currentSalary;
      // Apply salary growth for next year
      const growthData = SALARY_GROWTH_DATA.find((d) => d.year === year);
      if (growthData) {
        currentSalary *= growthData.indexation;
      } else {
        currentSalary *= 1.05; // Default 5% growth
      }
    }

    return (
      totalSalary / (simulationData.workEndYear - simulationData.workStartYear)
    );
  };

  const calculateSickLeaveReduction = (): number => {
    const sickDaysPerYear =
      simulationData.gender === "male"
        ? SICK_LEAVE_DATA.male
        : SICK_LEAVE_DATA.female;
    const workYears = simulationData.workEndYear - simulationData.workStartYear;
    const totalSickDays = sickDaysPerYear * workYears;
    const totalWorkingDays = workYears * 250; // Approximate working days per year

    return totalSickDays / totalWorkingDays;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="age" className="text-base font-medium">
                Wiek *
              </Label>
              <Input
                id="age"
                type="number"
                value={simulationData.age || ""}
                onChange={(e) =>
                  handleInputChange("age", parseInt(e.target.value) || 0)
                }
                placeholder="Wpisz swój wiek"
                className="h-12"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Płeć *</Label>
              <Select
                value={simulationData.gender}
                onValueChange={(value: "male" | "female") =>
                  handleInputChange("gender", value)
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Wybierz płeć" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Mężczyzna</SelectItem>
                  <SelectItem value="female">Kobieta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="salary" className="text-base font-medium">
                Wysokość wynagrodzenia brutto (PLN) *
              </Label>
              <div className="relative">
                <Input
                  id="salary"
                  type="text"
                  value={formatCurrency(simulationData.grossSalary.toString())}
                  onChange={(e) => handleCurrencyChange("grossSalary", e)}
                  placeholder="0"
                  className="h-12 pr-20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  PLN
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="workStart" className="text-base font-medium">
                Rok rozpoczęcia pracy *
              </Label>
              <Input
                id="workStart"
                type="number"
                value={simulationData.workStartYear || ""}
                onChange={(e) =>
                  handleInputChange(
                    "workStartYear",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="np. 2020"
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">
                Rok odnosi się do stycznia danego roku
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="workEnd" className="text-base font-medium">
                Planowany rok zakończenia aktywności zawodowej *
              </Label>
              <Input
                id="workEnd"
                type="number"
                value={simulationData.workEndYear || ""}
                onChange={(e) =>
                  handleInputChange(
                    "workEndYear",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="np. 2055"
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">
                Automatycznie ustawiony na rok osiągnięcia wieku emerytalnego (
                {RETIREMENT_AGE[simulationData.gender]} lat)
              </p>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Informacja:</strong> Rok rozpoczęcia i zakończenia pracy
                zawsze odnosi się do stycznia danego roku.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="zusAccount" className="text-base font-medium">
                Wysokość zgromadzonych środków na koncie w ZUS (PLN)
              </Label>
              <div className="relative">
                <Input
                  id="zusAccount"
                  type="text"
                  value={formatCurrency(
                    (simulationData.zusAccountFunds || 0).toString()
                  )}
                  onChange={(e) => handleCurrencyChange("zusAccountFunds", e)}
                  placeholder="0"
                  className="h-12 pr-20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  PLN
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Jeśli nie znasz tej kwoty, zostanie oszacowana na podstawie
                wynagrodzenia
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="zusSubAccount" className="text-base font-medium">
                Wysokość zgromadzonych środków na subkoncie w ZUS (PLN)
              </Label>
              <div className="relative">
                <Input
                  id="zusSubAccount"
                  type="text"
                  value={formatCurrency(
                    (simulationData.zusSubAccountFunds || 0).toString()
                  )}
                  onChange={(e) =>
                    handleCurrencyChange("zusSubAccountFunds", e)
                  }
                  placeholder="0"
                  className="h-12 pr-20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  PLN
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sickLeave"
                  checked={simulationData.includeSickLeave}
                  onCheckedChange={(checked) =>
                    handleInputChange("includeSickLeave", checked)
                  }
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

            {simulationData.includeSickLeave && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Średnie zwolnienia lekarskie w Polsce:</strong>
                    </p>
                    <p>• Mężczyźni: {SICK_LEAVE_DATA.male} dni rocznie</p>
                    <p>• Kobiety: {SICK_LEAVE_DATA.female} dni rocznie</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ta informacja zostanie uwzględniona w obliczeniach
                      emerytury
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 4:
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
                      <span className="text-sm text-muted-foreground">
                        Wiek:
                      </span>
                      <span className="text-sm font-medium">
                        {simulationData.age} lat
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Płeć:
                      </span>
                      <span className="text-sm font-medium">
                        {simulationData.gender === "male"
                          ? "Mężczyzna"
                          : "Kobieta"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Wynagrodzenie:
                      </span>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat("pl-PL").format(
                          simulationData.grossSalary
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
                        {simulationData.workStartYear}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Zakończenie:
                      </span>
                      <span className="text-sm font-medium">
                        {simulationData.workEndYear}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lata pracy:
                      </span>
                      <span className="text-sm font-medium">
                        {simulationData.workEndYear -
                          simulationData.workStartYear}{" "}
                        lat
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {(simulationData.zusAccountFunds ||
                simulationData.zusSubAccountFunds ||
                simulationData.includeSickLeave) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Dodatkowe informacje
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {simulationData.zusAccountFunds && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Konto ZUS:
                        </span>
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat("pl-PL").format(
                            simulationData.zusAccountFunds
                          )}{" "}
                          PLN
                        </span>
                      </div>
                    )}
                    {simulationData.zusSubAccountFunds && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Subkonto ZUS:
                        </span>
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat("pl-PL").format(
                            simulationData.zusSubAccountFunds
                          )}{" "}
                          PLN
                        </span>
                      </div>
                    )}
                    {simulationData.includeSickLeave && (
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
              onClick={calculateProjection}
              disabled={isCalculating}
              className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCalculating
                ? "Obliczanie..."
                : "Zaprognozuj moją przyszłą emeryturę"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Symulator przyszłej emerytury
          </h1>
          <p className="text-lg text-muted-foreground">
            Wypełnij formularz krok po kroku, aby poznać prognozę swojej
            emerytury
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Krok {currentStep} z {totalSteps}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Podstawowe dane osobowe"}
              {currentStep === 2 && "Okres aktywności zawodowej"}
              {currentStep === 3 && "Dodatkowe informacje"}
              {currentStep === 4 && "Podsumowanie i prognoza"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              className="mb-8"
            />

            <div className="min-h-[400px]">{renderStepContent()}</div>

            <Separator className="my-6" />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6"
              >
                Wstecz
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                >
                  Dalej
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Wszystkie kroki ukończone
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {projectionResult && (
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
                  <div className="text-sm text-muted-foreground">
                    Lata pracy
                  </div>
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
                    <strong>Uwaga:</strong> To jest uproszczona prognoza.
                    Rzeczywista wysokość emerytury może się różnić w zależności
                    od zmian w przepisach, inflacji i innych czynników.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
