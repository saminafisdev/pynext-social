import type { Profile } from "@/pages/profile/types/profile";

export interface ChatDetail {
  id: number;
  other_user: string;
}

export interface ChatParticipant {
  id: number;
  chat: number;
  profile: Profile;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: ChatParticipant;
  chat: number;
}
