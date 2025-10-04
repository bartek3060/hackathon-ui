"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendEvent } from "@/hooks/mutations/useSendEvent";
import { AppEventType } from "@/enums/app-event-types.enum";
import { getSessionId } from "@/lib/session";
import {
  simulationFormSchema,
  SimulationFormInterface,
} from "@/app/simulation/simulation-form.schema";
import {
  Step1BasicInfo,
  Step2WorkPeriod,
  Step3AdditionalInfo,
  Step4Review,
  StepHeader,
  FormActions,
  RealtimePlaceholderPanel,
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

export default function SimulationPage() {
  const { mutate, isPending } = useCalculatePension();
  const [currentStep, setCurrentStep] = useState(1);
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

  // Auto-calculate retirement year based on age and gender
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
      case 1:
        return (
          formValues.age > 0 &&
          formValues.gender !== undefined &&
          formValues.grossSalary > 0 &&
          !errors.age &&
          !errors.gender &&
          !errors.grossSalary
        );
      case 2:
        return (
          formValues.workStartYear > 0 &&
          formValues.workEndYear > 0 &&
          !errors.workStartYear &&
          !errors.workEndYear
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

  const calculateProjection = async (data: SimulationFormInterface) => {
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Podstawowe dane osobowe";
      case 2:
        return "Okres aktywności zawodowej";
      case 3:
        return "Dodatkowe informacje";
      case 4:
        return "Podsumowanie i obliczenia";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Wprowadź swoje dane demograficzne i obecne wynagrodzenie";
      case 2:
        return "Określ planowany okres aktywności zawodowej";
      case 3:
        return "Opcjonalnie uzupełnij informacje o zgromadzonym kapitale";
      case 4:
        return "Sprawdź wprowadzone dane i uruchom kalkulację";
      default:
        return "";
    }
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
    <div className="min-h-screen bg-white">
      {/* Header with logo */}
      <div className="absolute top-8 left-8 z-10">
        <a
          href="https://www.zus.pl/"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <img src="/logo.svg" alt="ZUS Logo" className="h-12 w-auto" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column - Form (60%) */}
          <div className="lg:col-span-3">
            <StepHeader
              title="Uzupełnij dane do symulacji"
              subtitle="Po zapisaniu danych pokażemy prognozy w czasie rzeczywistym."
            />

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Krok {currentStep} z {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-custom-2 transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-sm text-gray-600">{getStepDescription()}</p>
            </div>

            {/* Step Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              {renderStepContent()}
            </div>

            {/* Form Actions */}
            <FormActions
              onBack={prevStep}
              onNext={currentStep < totalSteps ? nextStep : undefined}
              onSubmit={currentStep === totalSteps ? () => calculateProjection(getValues()) : undefined}
              isBackDisabled={currentStep === 1}
              isNextDisabled={!isStepValid(currentStep)}
              showBack={true}
              showNext={currentStep < totalSteps}
              showSubmit={currentStep === totalSteps}
              isLoading={isPending}
            />
          </div>

          {/* Right Column - Placeholder (40%) */}
          <div className="lg:col-span-2">
            <RealtimePlaceholderPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

