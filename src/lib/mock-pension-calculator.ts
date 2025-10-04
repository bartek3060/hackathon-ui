import { CalculatedPensionDto } from "@/api/dtos/calculated-pension.dto";
import { CalculatePensionDto } from "@/api/dtos/calculate-pension.dto";

export function generateMockPensionData(
  input: CalculatePensionDto
): CalculatedPensionDto {
  const workYears =
    input.plannedWorkEndYear.getFullYear() - input.workStartYear.getFullYear();
  const currentYear = new Date().getFullYear();
  const retirementYear = input.plannedWorkEndYear.getFullYear();
  const yearsToRetirement = retirementYear - currentYear;

  // More realistic calculations based on Polish pension system
  const averageSalary = input.grossSalary;

  // Base pension calculation (simplified ZUS formula)
  const basePension = averageSalary * 0.24 * (workYears / 40); // 24% of salary for 40 years

  // Add impact of declared ZUS capital (if provided)
  // Annuitize combined capital over 20 years (240 months) as a simple heuristic
  const capitalAccount = input.amountOfMoneyInZusAccount ?? 0;
  const capitalSubAccount = input.amountOfMoneyInZusSubAccount ?? 0;
  const combinedCapital = capitalAccount + capitalSubAccount;
  const monthlyFromCapital = combinedCapital > 0 ? combinedCapital / 240 : 0;

  let monthlyPension = Math.round(
    Math.max(basePension, 1200) + monthlyFromCapital
  );

  // Inflation and real value
  const inflationRate = 0.035; // 3.5% annual inflation
  const monthlyPensionReal = Math.round(
    monthlyPension * Math.pow(1 - inflationRate, yearsToRetirement)
  );

  // Replacement rate (more realistic)
  const replacementRate = Math.min((monthlyPension / averageSalary) * 100, 80); // Cap at 80%

  // National average pension (increases over time)
  const averagePensionInRetirementYear = 3500 + (retirementYear - 2024) * 100;

  // Salary calculations
  const salaryWithoutSickLeave = averageSalary;
  const sickLeaveReduction = input.includeSickLeave ? 0.05 : 0; // 5% reduction if sick leave included
  const salaryWithSickLeave = averageSalary * (1 - sickLeaveReduction);

  // Future scenarios (realistic growth rates)
  const pensionAfter1Year = Math.round(monthlyPension * 1.08); // 8% increase
  const pensionAfter2Years = Math.round(monthlyPension * 1.15); // 15% increase
  const pensionAfter5Years = Math.round(monthlyPension * 1.35); // 35% increase

  // Expected vs actual (user expectation vs reality)
  const expectedPension = averageSalary * 0.65; // 65% of salary expectation
  const yearsToExpectedPension =
    monthlyPension < expectedPension
      ? Math.ceil((expectedPension - monthlyPension) / (monthlyPension * 0.08))
      : 0;

  // Additional metrics
  const totalWorkYears = workYears;
  const totalContributions = averageSalary * 12 * workYears * 0.1976; // ZUS contribution rate

  return {
    monthlyPension,
    monthlyPensionReal,
    averagePensionInRetirementYear,
    replacementRate,
    salaryWithoutSickLeave,
    salaryWithSickLeave,
    pensionAfter1Year,
    pensionAfter2Years,
    pensionAfter5Years,
    expectedPension,
    yearsToExpectedPension,
    totalWorkYears,
    totalContributions,
    inflationRate: inflationRate * 100, // Convert to percentage
    additionalYearsToReachDesiredPension: yearsToExpectedPension,
  };
}
