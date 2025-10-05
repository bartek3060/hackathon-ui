export interface ReceiveAdminReportDto {
  pensionFormId: number;
  realPensionWithIllness: number;
  realisticPensionWithIllness: number;
  realPensionWithoutIllness: number;
  realisticPensionWithoutIllness: number;
  sessionId: string;
  createdAt: string;
  age: number;
  gender: string;
  postalCode: string;
  salaryAmount: number;
  sickPeriodDays: number;
  accumulatedFundsInZusAccountAmount: number;
  accumulatedFundsInZusSubAccountAmount: number;
  expectedPension: number;
}
