export interface AdminAuth {
  email: string;
  loggedIn: boolean;
  timestamp: number;
}

export interface SimulatorUsage {
  id: string;
  usageDate: string;
  usageTime: string;
  expectedPension: number;
  age: number;
  gender: "M" | "F";
  salary: number;
  includesSickPeriods: boolean;
  accumulatedFunds: number;
  subAccountFunds: number;
  actualPension: number;
  realizedPension: number;
  postalCode: string;
}

export interface StatisticsData {
  totalUsage: number;
  avgExpectedPension: number;
  avgActualPension: number;
  avgAge: number;
  maleCount: number;
  femaleCount: number;
  ageStats: {
    under20: number;
    age20to29: number;
    age30to39: number;
    age40to49: number;
    age50to59: number;
    over59: number;
  };
}
