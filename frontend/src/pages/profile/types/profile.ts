export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  date_joined: string;
}

export interface Profile {
  id: number;
  user: User;
  bio: string;
  is_owner: boolean;
  profile_picture: string;
}
