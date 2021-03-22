import { Contact } from './contact';

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
  identifier: string;
  phoneNumber: string;
  viewed: boolean;
  createdAt: number;
  updatedAt: number;
  lastActive: number;
}

export interface FormattedProfile extends Profile {
  lastActiveFormatted: string;
  tagList: string[];
}

export interface Match extends Profile {
  matchedAt: number;
}

export interface FormattedMatch extends FormattedProfile {
  matchedAtFormatted: string;
}
