import { sendEnterEvent } from "@/api/send-event";
import { useMutation } from "@tanstack/react-query";

export const useSendEvent = () => {
  return useMutation({
    mutationFn: sendEnterEvent,
  });
};
