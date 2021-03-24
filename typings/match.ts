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

export interface Like {
  id: number; // profile id
  liked: boolean;
}

export enum MatchEvents {
  MATCH_INITIALIZE = 'phone:initializeMatch',
  MATCH_GET_PROFILES = 'phone:getMatchProfiles',
  MATCH_GET_PROFILES_SUCCESS = 'phone:getMatchProfilesSuccess',
  MATCH_GET_PROFILES_FAILED = 'phone:getMatchProfilesFailed',
  MATCH_GET_MY_PROFILE = 'phone:getMyProfile',
  MATCH_GET_MY_PROFILE_SUCCESS = 'phone:getMyProfileSuccess',
  MATCH_GET_MY_PROFILE_FAILED = 'phone:getMyProfileFailed',
  MATCH_UPDATE_MY_PROFILE = 'phone:updateMyProfile',
  MATCH_UPDATE_MY_PROFILE_SUCCESS = 'phone:updateMyProfileSuccess',
  MATCH_UPDATE_MY_PROFILE_FAILED = 'phone:updateMyProfileFailed',
  MATCH_GET_MATCHES = 'phone:getMatches',
  MATCH_GET_MATCHES_SUCCESS = 'phone:getMatchesSuccess',
  MATCH_GET_MATCHES_FAILED = 'phone:getMatchesFailed',
  MATCH_SAVE_LIKES = 'phone:saveLikes',
  MATCH_SAVE_LIKES_SUCCESS = 'phone:saveLikesSuccess',
  MATCH_SAVE_LIKES_FAILED = 'phone:saveLikesFailed',
  MATCH_NEW_MATCH = 'phone:newMatchFound',
}
