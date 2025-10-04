import { calculatePension } from "@/api/calculate-simulation";
import { useMutation } from "@tanstack/react-query";

export const useCalculatePension = () => {
  return useMutation({
    mutationFn: calculatePension,
  });
};
