import type { Profile } from "@/pages/profile/types/profile";

export interface Post {
  id: number;
  content: string;
  has_liked: boolean;
  likes_count: number;
  comments_count: number;
  is_owner: boolean;
  edited: boolean;
  created_at: Date;
  updated_at: Date;
  author: Profile;
}
