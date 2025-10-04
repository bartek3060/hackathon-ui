import { API_URL } from "@/env";
import axios from "axios";

export interface PensionGroup {
  name: string;
  description: string;
  population: number;
  lowerBound: number;
  upperBound: number;
}

export interface PensionGroupsResponse {
  pensionGroups: PensionGroup[];
}

export const getPensionGroups = async (): Promise<PensionGroupsResponse> => {
  const response = await axios.get<PensionGroupsResponse>(`${API_URL}/api/pension-groups`);
  
  return {
    pensionGroups: response.data.pensionGroups.map((group) => ({
      ...group,
      population: Math.round(group.population * 100 * 10) / 10,
    })),
  };
};

