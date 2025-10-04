export interface CalculatedPensionDto {
  // Main pension amounts
  monthlyPension: number;
  monthlyPensionReal: number; // Wysokość urealniona

  // Comparison data
  averagePensionInRetirementYear: number;
  replacementRate: number; // Stopa zastąpienia

  // Salary information
  salaryWithoutSickLeave: number;
  salaryWithSickLeave: number;

  // Future scenarios
  pensionAfter1Year: number;
  pensionAfter2Years: number;
  pensionAfter5Years: number;

  // Expected vs actual comparison
  expectedPension: number;
  yearsToExpectedPension: number; // Ile lat dłużej musi pracować

  // Additional metrics
  totalWorkYears: number;
  totalContributions: number;
  inflationRate: number;
  additionalYearsToReachDesiredPension: number;
}
