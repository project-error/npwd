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
  INITIALIZE = 'phone:initializeMatch',
  GET_PROFILES = 'phone:getMatchProfiles',
  GET_PROFILES_SUCCESS = 'phone:getMatchProfilesSuccess',
  GET_PROFILES_FAILED = 'phone:getMatchProfilesFailed',
  CREATE_MY_PROFILE = 'phone:createMyProfile',
  CREATE_MY_PROFILE_SUCCESS = 'phone:createMyProfileSuccess',
  CREATE_MY_PROFILE_FAILED = 'phone:createMyProfileFailed',
  GET_MY_PROFILE = 'phone:getMyProfile',
  GET_MY_PROFILE_SUCCESS = 'phone:getMyProfileSuccess',
  GET_MY_PROFILE_FAILED = 'phone:getMyProfileFailed',
  UPDATE_MY_PROFILE = 'phone:updateMyProfile',
  UPDATE_MY_PROFILE_SUCCESS = 'phone:updateMyProfileSuccess',
  UPDATE_MY_PROFILE_FAILED = 'phone:updateMyProfileFailed',
  GET_MATCHES = 'phone:getMatches',
  GET_MATCHES_SUCCESS = 'phone:getMatchesSuccess',
  GET_MATCHES_FAILED = 'phone:getMatchesFailed',
  SAVE_LIKES = 'phone:saveLikes',
  SAVE_LIKES_SUCCESS = 'phone:saveLikesSuccess',
  SAVE_LIKES_FAILED = 'phone:saveLikesFailed',
  NEW_MATCH = 'phone:newMatchFound',
}
