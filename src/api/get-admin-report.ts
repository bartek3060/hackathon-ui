import { API_URL } from "@/env";
import axios from "axios";
import { SendEventDto } from "./dtos/send-event.dto";
import { ReceivedAdminStatsDto } from "./dtos/received-admin-stats.dto";
import { ReceiveAdminReportDto } from "./dtos/receive-admin-report.dto";

export const getAdminReport = async () => {
  return await axios.get<ReceiveAdminReportDto[]>(
    `${API_URL}/api/admin/report`
  );
};
