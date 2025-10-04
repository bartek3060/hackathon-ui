import { useMutation } from "@tanstack/react-query";
import { createUserSession, type CreateUserSessionRequest } from "@/api/user";

export const useCreateUserSession = () => {
  return useMutation({
    mutationFn: (data: CreateUserSessionRequest) => createUserSession(data),
  });
};

