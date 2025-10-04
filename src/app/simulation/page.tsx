"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  Step5PostalCode,
  StepHeader,
  FormActions,
  RealtimePlaceholderPanel,
  RealtimeResultsPanel,
} from "./components";
import { useCalculatePension } from "@/hooks/mutations/useCalculatePension";
import { CalculatedPensionDto } from "@/api/dtos/calculated-pension.dto";

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
  const {
    mutate,
    isPending,
    data: calculationData,
    error: calculationError,
  } = useCalculatePension();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pensionResults, setPensionResults] = useState<
    CalculatedPensionDto | undefined
  >();
  const previousFormValuesRef = useRef<SimulationFormInterface | null>(null);
  const lastCalculatedStepRef = useRef<number>(0);

  const totalSteps = 5;

  // Helper function to check if form values have actually changed
  const hasFormValuesChanged = (
    currentValues: SimulationFormInterface
  ): boolean => {
    const previousValues = previousFormValuesRef.current;
    if (!previousValues) {
      console.log("No previous values, considering as changed");
      return true;
    }

    // Check only the fields that affect pension calculation
    const relevantFields: (keyof SimulationFormInterface)[] = [
      "age",
      "gender",
      "grossSalary",
      "workStartYear",
      "workEndYear",
      "includeSickLeave",
    ];

    const hasChanged = relevantFields.some((field) => {
      const current = currentValues[field];
      const previous = previousValues[field];

      // Handle date comparison (these fields are numbers, not dates)
      if (field === "workStartYear" || field === "workEndYear") {
        return current !== previous;
      }

      return current !== previous;
    });

    return hasChanged;
  };

  const form = useForm<SimulationFormInterface>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      age: 25,
      grossSalary: 5000,
      workStartYear: new Date().getFullYear(),
      workEndYear: new Date().getFullYear() + 40,
      postalCode: "",
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

  // Handle calculation results
  useEffect(() => {
    if (calculationData) {
      setPensionResults(calculationData);
    }
  }, [calculationData]);

  // Real-time calculation trigger only when form values change
  useEffect(() => {
    const previousFormValues = previousFormValuesRef.current;
    const formValues = getValues();

    const shouldChangeFromStep1 =
      currentStep === 2 &&
      (previousFormValues?.age !== formValues.age ||
        previousFormValues?.gender !== formValues.gender ||
        previousFormValues?.grossSalary !== formValues.grossSalary ||
        // workEndYear can change due to age/gender auto-calculation
        previousFormValues?.workEndYear !== formValues.workEndYear);

    const shouldChangeFromStep2 =
      currentStep === 3 &&
      (previousFormValues?.workStartYear !== formValues.workStartYear ||
        previousFormValues?.workEndYear !== formValues.workEndYear);

    const shouldChangeFromStep3 =
      currentStep === 4 &&
      (previousFormValues?.includeZusFields !== formValues.includeZusFields ||
        (formValues.includeZusFields === true &&
          (previousFormValues?.zusAccountFunds !== formValues.zusAccountFunds ||
            previousFormValues?.zusSubAccountFunds !==
              formValues.zusSubAccountFunds)) ||
        previousFormValues?.includeSickLeave !== formValues.includeSickLeave);

    const shouldChange =
      shouldChangeFromStep1 || shouldChangeFromStep2 || shouldChangeFromStep3;

    // Only recalculate if we have minimum data and are on step 2+
    if (shouldChange) {
      // Check if this is the first time we're calculating for this step
      const isFirstCalculation = !previousFormValuesRef.current;
      const isNewStep = currentStep > lastCalculatedStepRef.current;

      // Trigger if it's the first time, a forward step, or per-step relevant fields changed
      if (isFirstCalculation || isNewStep || shouldChange) {
        const timeoutId = setTimeout(() => {
          calculateProjection(formValues);
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentStep]);

  // Removed per requirement: do not recalc on field changes within a step

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("pl-PL").format(parseInt(numbers));
  };

  const includeZusFields = useWatch({
    control,
    name: "includeZusFields",
  }) as boolean;
  const includeSickLeave = useWatch({
    control,
    name: "includeSickLeave",
  }) as boolean;
  const zusAccountFunds = useWatch({
    control,
    name: "zusAccountFunds",
  }) as number | undefined;
  const zusSubAccountFunds = useWatch({
    control,
    name: "zusSubAccountFunds",
  }) as number | undefined;

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
      case 5:
        return true; // Optional postal code step
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
    try {
      setIsCalculating(true);

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
        ...(data.includeZusFields && {
          amountOfMoneyInZusAccount: data.zusAccountFunds || 0,
          amountOfMoneyInZusSubAccount: data.zusSubAccountFunds || 0,
        }),
        includeSickLeave: data.includeSickLeave || false,
      };

      // Use the mutation which now handles fallback to mock data
      mutate(dtoPayload, {
        onSuccess: (result) => {
          setPensionResults(result);
          setIsCalculating(false);
          // Update the previous values reference after successful calculation
          previousFormValuesRef.current = { ...data };
          // Update the last calculated step
          lastCalculatedStepRef.current = currentStep;
        },
        onError: (error) => {
          console.error("Calculation error:", error);
          setIsCalculating(false);
        },
      });
    } catch (error) {
      console.error("Calculation error:", error);
      setIsCalculating(false);
    }
  };

  const handleSkipPostalCode = () => {
    toast.info("Przechodzimy dalej do wyników symulacji.");
    calculateProjection(getValues());
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
        return "Podsumowanie danych";
      case 5:
        return "Dane regionalne (opcjonalnie)";
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
        return "Sprawdź wprowadzone dane przed zapisaniem";
      case 5:
        return "Pomóż nam lepiej analizować sytuację emerytalną w Polsce";
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
        return <Step4Review control={control} />;
      case 5:
        return <Step5PostalCode control={control} errors={errors} />;
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

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Column - Form (60%) */}
        <div className="bg-white flex items-center justify-center p-12">
          <div className="max-w-2xl w-full space-y-8">
            <StepHeader
              title="Uzupełnij dane do symulacji"
              subtitle="Po zapisaniu danych pokażemy prognozy w czasie rzeczywistym."
            />

            {/* Progress Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
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
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">
                {getStepTitle()}
              </h2>
              <p className="text-sm text-gray-600">{getStepDescription()}</p>
            </div>

            {/* Step Content */}
            <div className="space-y-6">{renderStepContent()}</div>

            {/* Form Actions */}
            <FormActions
              onBack={prevStep}
              onNext={currentStep < totalSteps ? nextStep : undefined}
              onSubmit={
                currentStep === totalSteps
                  ? () => {
                      const values = getValues();
                      if (values.postalCode) {
                        toast.success(
                          "Dziękujemy! Twoje dane pomogą nam lepiej analizować sytuację emerytalną w Polsce."
                        );
                      }
                      calculateProjection(values);
                    }
                  : undefined
              }
              onSkip={
                currentStep === totalSteps ? handleSkipPostalCode : undefined
              }
              isBackDisabled={currentStep === 1}
              isNextDisabled={!isStepValid(currentStep)}
              showBack={true}
              showNext={currentStep < totalSteps}
              showSubmit={currentStep === totalSteps}
              showSkip={currentStep === totalSteps}
              submitLabel={
                currentStep === totalSteps ? "Zapisz i zakończ" : undefined
              }
              isLoading={isPending}
            />
          </div>
        </div>

        {/* Right Column - Results Panel */}
        <div className="relative h-screen">
          <div className="absolute inset-0 p-8 overflow-y-auto">
            {pensionResults ? (
              <RealtimeResultsPanel
                data={pensionResults}
                isLoading={isCalculating || isPending}
                error={calculationError?.message}
              />
            ) : (
              <RealtimePlaceholderPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
