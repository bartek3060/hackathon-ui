import { AppEventType } from "@/enums/app-event-types.enum";

export interface SendEventDto {
  eventType: AppEventType;
  sessionId: string;
}
