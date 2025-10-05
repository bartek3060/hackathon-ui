import { getAdminReport } from "@/api/get-admin-report";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAdminReport = () => {
  return useQuery({
    queryKey: ["admin-report"],
    queryFn: getAdminReport,
  });
};
