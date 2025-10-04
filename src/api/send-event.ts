import { API_URL } from "@/env";
import axios from "axios";
import { SendEventDto } from "./dtos/send-event.dto";

export const sendEnterEvent = async (dto: SendEventDto) =>
  await axios.post<SendEventDto>(`${API_URL}/api/event`, dto);
