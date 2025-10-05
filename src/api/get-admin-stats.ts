import { API_URL } from "@/env";
import axios from "axios";
import { SendEventDto } from "./dtos/send-event.dto";
import { ReceivedAdminStatsDto } from "./dtos/received-admin-stats.dto";

export const getAdminStats = async () =>
  await axios.get<ReceivedAdminStatsDto>(`${API_URL}/api/admin/statistics`);
