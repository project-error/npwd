export interface Tweet {
  id: number;
  profile_name?: string;
  profile_id: number;
  avatar_url?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  images?: string;
  likes?: number;
}

export interface Profile {
  id: number;
  profile_name: string;
  identifier: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  job?: string;
  createdAt: string;
  updatedAt: string;
}
