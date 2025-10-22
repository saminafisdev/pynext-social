import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface ChatReponseItem {
  id: number;
  other_user: string;
}

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

interface Response {
  chats: ChatReponseItem[];
  suggested_profiles: ProfileResponseItem[];
}

async function fetchChatProfiles(query?: string) {
  const { data } = await api.get<Response>("chats/search/", {
    params: query ? { q: query } : undefined,
  });
  return data;
}

export function useChatProfiles(query?: string) {
  return useQuery({
    queryKey: ["profiles", query ?? ""],
    queryFn: () => fetchChatProfiles(query),
    staleTime: 60 * 1000,
  });
}
