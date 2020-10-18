export interface Tweet {
  id: number;
  profile_name?: string;
  avatar_url?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  images?: string;
  likes?: number;
}
