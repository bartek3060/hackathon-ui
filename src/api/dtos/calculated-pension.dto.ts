export interface CalculatedPensionDto {
  // Pension amounts with and without sick leave
  pensionWithSick: number;
  pensionWithSickRealistic: number;
  pensionWithoutSick: number;
  pensionWithoutSickRealistic: number;

  // Replacement rate
  replacementRate: number; // Stopa zastąpienia

  // Future scenarios
  pensionAfter1Year: number;
  pensionAfter2Years: number;
  pensionAfter5Years: number;

  // Expected pension
  expectedPension: number;

  // Additional metrics
  totalWorkYears: number;
  totalContributions: number;
  inflationRate: number;
  additionalYearsToReachDesiredPension: number;
}
