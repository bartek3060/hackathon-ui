export interface CalculatedPensionDto {
  pensionWithSick: number;
  pensionWithSickRealistic: number;
  pensionWithoutSick: number;
  pensionWithoutSickRealistic: number;

  replacementRate: number;

  pensionAfter1Year: number;
  pensionAfter2Years: number;
  pensionAfter5Years: number;

  expectedPension: number;

  totalWorkYears: number;
  totalContributions: number;
  inflationRate: number;
  additionalYearsToReachDesiredPension: number;
}
