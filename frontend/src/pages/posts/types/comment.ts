export type Comment = {
  id: number;
  author: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      full_name: string;
      username: string;
      email: string;
    };
    bio: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
};
