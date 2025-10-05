export interface CalculatePensionDto {
  sessionId: string; // UUID as string
  gender: string;
  birthDate: string; // LocalDate as string (ISO format)
  grossSalary: number;
  workStartYear: string; // LocalDate as string (ISO format)
  plannedWorkEndYear: string; // LocalDate as string (ISO format)
  amountOfMoneyInZusAccount: number;
  amountOfMoneyInZusSubAccount: number;
  includeSickLeave: boolean;
  postalCode: string;
}
