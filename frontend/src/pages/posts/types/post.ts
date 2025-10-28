import type { Profile } from "@/pages/profile/types/profile";

export interface Post {
  id: number;
  content: string | null;
  image: string | undefined;
  has_liked: boolean;
  likes_count: number;
  comments_count: number;
  is_owner: boolean;
  is_bookmarked: boolean;
  edited: boolean;
  created_at: Date;
  updated_at: Date;
  author: Profile;
}
