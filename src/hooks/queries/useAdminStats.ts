import { getAdminStats } from "@/api/get-admin-stats";
import { getPensionGroups } from "@/api/pension-groups";
import { useQuery } from "@tanstack/react-query";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });
};
