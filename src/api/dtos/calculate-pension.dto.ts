export interface CalculatePensionDto {
  age: number;
  gender: string;
  birthDate: Date;
  grossSalary: number;
  workStartYear: Date;
  plannedWorkEndYear: Date;
  amountOfMoneyInZusAccount?: number;
  amountOfMoneyInZusSubAccount?: number;
  includeSickLeave: boolean;
};
