"use client";

import { useSendEvent } from "@/hooks/mutations/useSendEvent";
import { RetirementSimulator } from "./components/RetirementSimulator";
import { useEffect } from "react";
import { AppEventType } from "@/enums/app-event-types.enum";
import { getSessionId } from "@/lib/session";

export default function Home() {
  const { mutate } = useSendEvent();

  useEffect(() => {
    mutate({
      eventType: AppEventType.ENTER_PAGE,
      sessionId: getSessionId(),
    });
  }, []);

  return <RetirementSimulator />;
}
