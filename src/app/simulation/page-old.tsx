"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { Separator } from "@/components/ui/separator";

import { useSendEvent } from "@/hooks/mutations/useSendEvent";
import { AppEventType } from "@/enums/app-event-types.enum";
import { getSessionId } from "@/lib/session";
import {
  simulationFormSchema,
  SimulationFormData,
  SimulationFormInterface,
} from "@/app/simulation/simulation-form.schema";
import { z } from "zod";
import {
  Step1BasicInfo,
  Step2WorkPeriod,
  Step3AdditionalInfo,
  Step4Review,
  SimulationResults,
} from "./components";
import { useCalculatePension } from "@/hooks/mutations/useCalculatePension";

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

interface SimulationProjectionResult {
  monthlyPension: number;
  yearlyPension: number;
  workYears: number;
  avgSalary: number;
  sickLeaveReduction: number;
  sickLeaveDays: number;
}

export default function SimulationPage() {
  const { mutate, isPending } = useCalculatePension();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectionResult, setProjectionResult] =
    useState<SimulationProjectionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 4;

  const form = useForm<SimulationFormInterface>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      age: 25,
      grossSalary: 5000,
      workStartYear: new Date().getFullYear(),
      workEndYear: new Date().getFullYear() + 40,
    },
    mode: "onChange",
    shouldUnregister: false, // Keep form values when navigating
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = form;

  // Watch form values for auto-calculation
  const watchedAge = watch("age");
  const watchedGender = watch("gender");

  // Auto-calculate retirement year based on sessionId and gender
  useEffect(() => {
    if (watchedAge > 0 && watchedGender) {
      const retirementAge =
        RETIREMENT_AGE[watchedGender as keyof typeof RETIREMENT_AGE];
      const currentYear = new Date().getFullYear();
      const yearsToRetirement = retirementAge - watchedAge;
      const retirementYear = currentYear + yearsToRetirement;

      setValue("workEndYear", retirementYear, { shouldDirty: false });
    }
  }, [watchedAge, watchedGender, setValue]);

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("pl-PL").format(parseInt(numbers));
  };

  const isStepValid = (step: number): boolean => {
    const formValues = watch();

    switch (step) {
      case 0:
        return (
          formValues.age > 0 &&
          formValues.gender !== undefined &&
          formValues.grossSalary > 0 &&
          !errors.age &&
          !errors.gender &&
          !errors.grossSalary
        );
      case 1:
        return (
          formValues.workStartYear > 0 &&
          formValues.workEndYear > 0 &&
          !errors.workStartYear &&
          !errors.workEndYear
        );
      case 2:
        return true; // Optional fields
      case 3:
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
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any step that is valid or already completed
    // Step 0 is always accessible (basic info)
    // Allow going back to any previous step
    // Allow going forward only if current step is valid
    if (
      stepIndex === 0 ||
      stepIndex < currentStep ||
      (stepIndex === currentStep + 1 && isStepValid(currentStep))
    ) {
      setCurrentStep(stepIndex);
    }
  };

  const calculateProjection = async (data: SimulationFormInterface) => {
    const workYears = data.workEndYear - data.workStartYear;
    const avgSalary = calculateAverageSalary(data);
    const sickLeaveReduction = data.includeSickLeave
      ? calculateSickLeaveReduction(data)
      : 0;

    // Simplified pension calculation (this would be more complex in reality)
    const basePension = (avgSalary * 0.24 * workYears) / 12; // 24% contribution rate
    const finalPension = basePension * (1 - sickLeaveReduction);

    // Convert to DTO format for API call
    const currentYear = new Date().getFullYear();
    const birthDate = new Date(currentYear - data.age, 0, 1);
    const workStartDate = new Date(data.workStartYear, 0, 1);
    const workEndDate = new Date(data.workEndYear, 0, 1);

    const dtoPayload = {
      age: data.age,
      gender: data.gender || "male",
      birthDate,
      grossSalary: data.grossSalary,
      workStartYear: workStartDate,
      plannedWorkEndYear: workEndDate,
      amountOfMoneyInZusAccount: data.zusAccountFunds || 0,
      amountOfMoneyInZusSubAccount: data.zusSubAccountFunds || 0,
      includeSickLeave: data.includeSickLeave || false,
    };

    mutate(dtoPayload);
  };

  const calculateAverageSalary = (data: SimulationFormInterface): number => {
    let currentSalary = data.grossSalary;
    let totalSalary = 0;

    for (let year = data.workStartYear; year < data.workEndYear; year++) {
      totalSalary += currentSalary;
      // Apply salary growth for next year
      const growthData = SALARY_GROWTH_DATA.find((d) => d.year === year);
      if (growthData) {
        currentSalary *= growthData.indexation;
      } else {
        currentSalary *= 1.05; // Default 5% growth
      }
    }

    return totalSalary / (data.workEndYear - data.workStartYear);
  };

  const calculateSickLeaveReduction = (
    data: SimulationFormInterface
  ): number => {
    const sickDaysPerYear =
      data.gender === "male" ? SICK_LEAVE_DATA.male : SICK_LEAVE_DATA.female;
    const workYears = data.workEndYear - data.workStartYear;
    const totalSickDays = sickDaysPerYear * workYears;
    const totalWorkingDays = workYears * 250; // Approximate working days per year

    return totalSickDays / totalWorkingDays;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            control={control}
            errors={errors}
            formatCurrency={formatCurrency}
          />
        );
      case 2:
        return (
          <Step2WorkPeriod
            control={control}
            errors={errors}
            watchedGender={watchedGender}
          />
        );
      case 3:
        return (
          <Step3AdditionalInfo
            control={control}
            errors={errors}
            formatCurrency={formatCurrency}
          />
        );
      case 4:
        return (
          <Step4Review
            control={control}
            calculateProjection={calculateProjection}
            isCalculating={isCalculating}
          />
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
              onStepClick={handleStepClick}
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

        <SimulationResults projectionResult={projectionResult} />
      </div>
    </div>
  );
}
