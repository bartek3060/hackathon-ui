import axios from "axios";
import { API_URL } from "@/env";
import { CalculatePensionDto } from "./dtos/calculate-pension.dto";
import { CalculatedPensionDto } from "./dtos/calculated-pension.dto";
import { generateMockPensionData } from "@/lib/mock-pension-calculator";

export const calculatePension = async (
  dto: CalculatePensionDto
): Promise<CalculatedPensionDto> => {
  try {
    // Try real API first
    const response = await axios.post<CalculatedPensionDto>(
      `${API_URL}/api/pension/calculate`,
      dto
    );
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available
    console.warn("API not available, using mock data:", error);
    return generateMockPensionData(dto);
  }
};
