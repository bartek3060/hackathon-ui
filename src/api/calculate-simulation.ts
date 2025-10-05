import axios from "axios";
import { API_URL } from "@/env";
import { CalculatePensionDto } from "./dtos/calculate-pension.dto";
import { CalculatedPensionDto } from "./dtos/calculated-pension.dto";
import { generateMockPensionData } from "@/lib/mock-pension-calculator";

export const calculatePension = async (
  dto: CalculatePensionDto
): Promise<CalculatedPensionDto> => {
  try {
    const response = await axios.post<CalculatedPensionDto>(
      `${API_URL}/api/pension/calculate`,
      dto
    );
    return response.data;
  } catch (error) {
    console.warn("API not available, using mock data:", error);
    return generateMockPensionData(dto);
  }
};
