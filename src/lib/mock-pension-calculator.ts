import { CalculatedPensionDto } from "@/api/dtos/calculated-pension.dto";
import { CalculatePensionDto } from "@/api/dtos/calculate-pension.dto";

export function generateMockPensionData(
  input: CalculatePensionDto
): CalculatedPensionDto {
  const workStartYear = new Date(input.workStartYear).getFullYear();
  const workEndYear = new Date(input.plannedWorkEndYear).getFullYear();
  const workYears = workEndYear - workStartYear;
  const currentYear = new Date().getFullYear();
  const retirementYear = workEndYear;
  const yearsToRetirement = retirementYear - currentYear;

  const averageSalary = input.grossSalary;

  const basePension = averageSalary * 0.24 * (workYears / 40);

  const capitalAccount = input.amountOfMoneyInZusAccount;
  const capitalSubAccount = input.amountOfMoneyInZusSubAccount;
  const combinedCapital = capitalAccount + capitalSubAccount;
  const monthlyFromCapital = combinedCapital > 0 ? combinedCapital / 240 : 0;

  const sickLeaveReduction = input.includeSickLeave ? 0.05 : 0;

  const pensionWithSick = Math.round(
    Math.max(basePension * (1 - sickLeaveReduction), 1200) + monthlyFromCapital
  );

  const pensionWithoutSick = Math.round(
    Math.max(basePension, 1200) + monthlyFromCapital
  );

  const inflationRate = 0.035;
  const pensionWithSickRealistic = Math.round(
    pensionWithSick * Math.pow(1 - inflationRate, yearsToRetirement)
  );

  const pensionWithoutSickRealistic = Math.round(
    pensionWithoutSick * Math.pow(1 - inflationRate, yearsToRetirement)
  );

  const replacementRate = Math.min((pensionWithSick / averageSalary) * 100, 80);

  const pensionAfter1Year = Math.round(pensionWithSick * 1.08);
  const pensionAfter2Years = Math.round(pensionWithSick * 1.15);
  const pensionAfter5Years = Math.round(pensionWithSick * 1.35);

  const expectedPension = averageSalary * 0.65;
  const additionalYearsToReachDesiredPension =
    pensionWithSick < expectedPension
      ? Math.ceil(
          (expectedPension - pensionWithSick) / (pensionWithSick * 0.08)
        )
      : 0;

  const totalWorkYears = workYears;
  const totalContributions = averageSalary * 12 * workYears * 0.1976;

  return {
    pensionWithSick,
    pensionWithSickRealistic,
    pensionWithoutSick,
    pensionWithoutSickRealistic,
    replacementRate,
    pensionAfter1Year,
    pensionAfter2Years,
    pensionAfter5Years,
    expectedPension,
    totalWorkYears,
    totalContributions,
    inflationRate: inflationRate * 100,
    additionalYearsToReachDesiredPension,
  };
}
