export interface NewTweet {
  message: string;
  images?: string;
  retweet?: number;
}

export type SETTING_MENTIONS = 'mentions';
export type SETTINGS_ALL_TWEETS = 'all';

export interface Tweet extends NewTweet {
  profile_name: string;
  profile_id: number;
  id: number;
  identifier: string;
  isMine: boolean;
  isLiked: boolean;
  isReported: boolean;
  avatar_url: string;
  isRetweet: number | boolean;
  isRetweetedByPlayer?: boolean;
  retweetIdentifier: string;
  retweetId: string;
  seconds_since_tweet: number;
  retweetProfileName: string;
  retweetAvatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  link: string;
}
export interface FormattedTweet extends Omit<Tweet, 'images'> {
  images: Image[];
}

export interface TwitterProfile {
  id: number;
  profile_name: string;
  identifier: string;
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileProps {
  avatar_url: string;
  profile_name: string;
}

export enum TwitterEvents {
  FETCH_TWEETS = 'npwd:fetchTweets',
  FETCH_TWEETS_FILTERED = 'npwd:fetchTweetsFiltered',
  CREATE_PROFILE = 'npwd:createTwitterProfile',
  GET_OR_CREATE_PROFILE = 'npwd:getOrCreateTwitterProfile',
  UPDATE_PROFILE = 'npwd:updateTwitterProfile',
  CREATE_TWEET = 'npwd:createTweet',
  CREATE_TWEET_BROADCAST = 'createTweetBroadcast',
  DELETE_TWEET = 'npwd:deleteTweet',
  TOGGLE_LIKE = 'npwd:toggleLike',
  RETWEET = 'npwd:retweet',
  REPORT = 'npwd:reportTweet',
}
