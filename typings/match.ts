export interface NewProfile {
  name: string;
}

export interface Profile extends NewProfile {
  id: number;
  image: string;
  bio: string;
  createdAt: number;
  updatedAt: number;
  lastActive: number;
}
