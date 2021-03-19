export interface NewProfile {
  name: string;
  image: string;
  bio: string;
  job: string;
  location: string;
  tags: string;
}

export interface Profile extends NewProfile {
  id: number;
  createdAt: number;
  updatedAt: number;
  lastActive: number;
}

export interface FormattedProfile extends NewProfile {
  id: number;
  createdAt: number;
  updatedAt: number;
  lastActive: string;
  viewed: boolean;
  tagList: string[];
}
