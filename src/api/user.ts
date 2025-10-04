import { API_URL } from "@/env";
import axios from "axios";

export interface CreateUserSessionRequest {
  sessionId: string;
  expectedPension: number;
}

export interface CreateUserSessionResponse {
  sessionId: string;
  expectedPension: number;
}

export const createUserSession = async (
  data: CreateUserSessionRequest
): Promise<CreateUserSessionResponse> => {
  const response = await axios.post<CreateUserSessionResponse>(
    `${API_URL}/api/user`,
    data
  );
  return response.data;
};

