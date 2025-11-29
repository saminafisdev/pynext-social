import type { Profile } from "@/pages/profile/types/profile";

export interface PostImage {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface Post {
  id: number;
  content: string | null;
  images: PostImage[];
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
