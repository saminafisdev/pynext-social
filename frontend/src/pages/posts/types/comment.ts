import type { Profile } from "@/pages/profile/types/profile";

export type Comment = {
  id: number;
  author: Profile;
  content: string;
  created_at: string;
  updated_at: string;
};
