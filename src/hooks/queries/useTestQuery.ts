import { testGetEndpoint } from "@/api/test-endpoint";
import { useQuery } from "@tanstack/react-query";

export const useTestQuery = () => {
  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: testGetEndpoint,
  });
  return data;
};
