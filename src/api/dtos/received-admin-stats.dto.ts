export interface ReceivedAdminStatsDto {
  totalSimulations: number;
  averageExpectedPension: number;
  averageRealPension: number;
  averageAge: number;
  genderStats: {
    menCount: number;
    womenCount: number;
  };
  ageStats: {
    under20: number;
    age20to29: number;
    age30to39: number;
    age40to49: number;
    age50to59: number;
    over59: number;
  };
}
