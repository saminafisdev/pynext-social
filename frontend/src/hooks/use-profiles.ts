import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface ProfileResponseItem {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    username: string;
    email: string;
    date_joined: string;
  };
  bio: string | null;
  is_owner: boolean;
  profile_picture: string | null;
  cover_photo: string | null;
}

async function fetchProfiles(query?: string) {
  const { data } = await api.get<ProfileResponseItem[]>("profiles/", {
    params: query ? { query } : undefined,
  });
  return data;
}

export function useProfiles(query?: string) {
  return useQuery({
    queryKey: ["profiles", query ?? ""],
    queryFn: () => fetchProfiles(query),
    staleTime: 60 * 1000,
  });
}
