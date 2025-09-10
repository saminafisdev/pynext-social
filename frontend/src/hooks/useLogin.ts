import api from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

interface LoginPayload {
  username: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ username, password }: LoginPayload) => {
      const { data } = await api.post("auth/jwt/create/", {
        username,
        password,
      });
      return data;
    },
  });
}
