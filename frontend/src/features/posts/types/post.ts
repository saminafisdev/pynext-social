export interface Post {
  id: number;
  content: string;
  has_liked: boolean;
  likes_count: number;
  comments_count: number;
  created_at: Date;
  updated_at: Date;
  author: {
    id: number;
    bio?: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      full_name: string;
      username: string;
      email: string;
    };
  };
}
