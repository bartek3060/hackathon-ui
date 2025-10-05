import { CalculatedPensionDto } from "@/api/dtos/calculated-pension.dto";
import { CalculatePensionDto } from "@/api/dtos/calculate-pension.dto";

export function generateMockPensionData(
  input: CalculatePensionDto
): CalculatedPensionDto {
  // Parse string dates to get years
  const workStartYear = new Date(input.workStartYear).getFullYear();
  const workEndYear = new Date(input.plannedWorkEndYear).getFullYear();
  const workYears = workEndYear - workStartYear;
  const currentYear = new Date().getFullYear();
  const retirementYear = workEndYear;
  const yearsToRetirement = retirementYear - currentYear;

  // More realistic calculations based on Polish pension system
  const averageSalary = input.grossSalary;

  // Base pension calculation (simplified ZUS formula)
  const basePension = averageSalary * 0.24 * (workYears / 40); // 24% of salary for 40 years

  // Add impact of declared ZUS capital (if provided)
  // Annuitize combined capital over 20 years (240 months) as a simple heuristic
  const capitalAccount = input.amountOfMoneyInZusAccount;
  const capitalSubAccount = input.amountOfMoneyInZusSubAccount;
  const combinedCapital = capitalAccount + capitalSubAccount;
  const monthlyFromCapital = combinedCapital > 0 ? combinedCapital / 240 : 0;

  // Calculate pension with and without sick leave impact
  const sickLeaveReduction = input.includeSickLeave ? 0.05 : 0; // 5% reduction if sick leave included

  const pensionWithSick = Math.round(
    Math.max(basePension * (1 - sickLeaveReduction), 1200) + monthlyFromCapital
  );

  const pensionWithoutSick = Math.round(
    Math.max(basePension, 1200) + monthlyFromCapital
  );

  // Inflation and real values
  const inflationRate = 0.035; // 3.5% annual inflation
  const pensionWithSickRealistic = Math.round(
    pensionWithSick * Math.pow(1 - inflationRate, yearsToRetirement)
  );

  const pensionWithoutSickRealistic = Math.round(
    pensionWithoutSick * Math.pow(1 - inflationRate, yearsToRetirement)
  );

  // Replacement rate (more realistic) - use pension with sick leave for comparison
  const replacementRate = Math.min((pensionWithSick / averageSalary) * 100, 80); // Cap at 80%

  // Future scenarios (realistic growth rates) - based on pension with sick leave
  const pensionAfter1Year = Math.round(pensionWithSick * 1.08); // 8% increase
  const pensionAfter2Years = Math.round(pensionWithSick * 1.15); // 15% increase
  const pensionAfter5Years = Math.round(pensionWithSick * 1.35); // 35% increase

  // Expected vs actual (user expectation vs reality)
  const expectedPension = averageSalary * 0.65; // 65% of salary expectation
  const additionalYearsToReachDesiredPension =
    pensionWithSick < expectedPension
      ? Math.ceil(
          (expectedPension - pensionWithSick) / (pensionWithSick * 0.08)
        )
      : 0;

  // Additional metrics
  const totalWorkYears = workYears;
  const totalContributions = averageSalary * 12 * workYears * 0.1976; // ZUS contribution rate

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
    inflationRate: inflationRate * 100, // Convert to percentage
    additionalYearsToReachDesiredPension,
  };
}
