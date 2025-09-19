import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  const { data } = await api.get("profiles/current/");
  return data;
}

export function useUser() {
  return useQuery({
    queryFn: fetchUser,
    queryKey: ["user"],
    staleTime: 5 * 60 * 1000,
  });
}
