import { getPensionGroups } from "@/api/pension-groups";
import { useQuery } from "@tanstack/react-query";

export const usePensionGroups = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["pension-groups"],
    queryFn: getPensionGroups,
    enabled,
  });
};

