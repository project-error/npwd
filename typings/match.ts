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

export interface Like {
  id: number; // profile id
  liked: boolean;
}

export enum MatchResp {
  UPDATE_FAILED = 'MATCH.FEEDBACK.UPDATE_PROFILE_FAILED',
}

export enum MatchEvents {
  INITIALIZE = 'phone:initializeMatch',
  GET_PROFILES = 'phone:getMatchProfiles',
  CREATE_MY_PROFILE = 'phone:createMyProfile',
  GET_MY_PROFILE = 'phone:getMyProfile',
  UPDATE_MY_PROFILE = 'phone:updateMyProfile',
  GET_MATCHES = 'phone:getMatches',
  SAVE_LIKES = 'phone:saveLikes',
}
