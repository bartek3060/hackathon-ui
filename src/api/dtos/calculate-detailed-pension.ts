export interface CalculateDetailedPensionDto {
  sessionId: string;
  gender: string;
  birthDate: string;
  grossSalary: number;
  workStartYear: string;
  plannedWorkEndYear: string;
  amountOfMoneyInZusAccount: number;
  amountOfMoneyInZusSubAccount: number;
  includeSickLeave: boolean;
  postalCode: string;
  particularSalaries: { year: number; salary: number }[];
  particularSickLeave: { year: number; days: number }[];
  yearIndexation: number[];
  shouldUsePreviousZusAmount: boolean;
}
