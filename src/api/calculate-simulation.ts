import axios from "axios";
import { API_URL } from "@/env";
import { CalculatePensionDto } from "./dtos/calculate-pension.dto";
import { CalculatedPensionDto } from "./dtos/calculated-pension.dto";

export const calculatePension = async (dto: CalculatePensionDto) =>
  await axios.post<CalculatePensionDto, CalculatedPensionDto>(
    `${API_URL}/api/pension/calculate`,
    dto
  );
