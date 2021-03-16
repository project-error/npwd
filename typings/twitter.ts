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

export enum TwitterEvents {
  FETCH_TWEETS = 'npwd:fetchTweets',
  FETCH_TWEETS_SUCCESS = 'npwd:fetchTweets',
  FETCH_TWEETS_FAILURE = 'npwd:fetchTweetsFailed',
  FETCH_TWEETS_FILTERED = 'npwd:fetchTweetsFiltered',
  FETCH_TWEETS_FILTERED_SUCCESS = 'npwd:fetchTweetsFiltered',
  FETCH_TWEETS_FILTERED_FAILURE = 'npwd:fetchTweetsFilteredFailed',
  CREATE_PROFILE = 'npwd:createTwitterProfile',
  CREATE_PROFILE_RESULT = 'npwd:createProfileResult',
  GET_OR_CREATE_PROFILE = 'npwd:getOrCreateTwitterProfile',
  GET_OR_CREATE_PROFILE_NULL = 'npwd:getOrCreateTwitterProfileNull',
  GET_OR_CREATE_PROFILE_SUCCESS = 'npwd:getOrCreateTwitterProfile',
  GET_OR_CREATE_PROFILE_FAILURE = 'npwd:getOrCreateTwitterProfileFailed',
  UPDATE_PROFILE = 'npwd:updateTwitterProfile',
  UPDATE_PROFILE_LOADING = 'npwd:updateProfileLoading',
  UPDATE_PROFILE_RESULT = 'npwd:updateProfileResult',
  CREATE_TWEET = 'npwd:createTweet',
  CREATE_TWEET_LOADING = 'npwd:createTweetLoading',
  CREATE_TWEET_RESULT = 'npwd:createTweetResult',
  CREATE_TWEET_BROADCAST = 'npwd:createTweetBroadcast',
  CREATE_TWEET_FAILURE = 'npwd:createTweetResultFailed',
  DELETE_TWEET = 'npwd:deleteTweet',
  DELETE_TWEET_SUCCESS = 'npwd:deleteTweetSuccess',
  DELETE_TWEET_FAILURE = 'npwd:deleteTweetFailed',
  TOGGLE_LIKE = 'npwd:toggleLike',
  TOGGLE_LIKE_SUCCESS = 'npwd:toggleLikeSuccess',
  TOGGLE_LIKE_FAILURE = 'npwd:toggleLikeFailed',
  RETWEET = 'npwd:retweet',
  RETWEET_SUCCESS = 'npwd:retweetSuccess',
  RETWEET_EXISTS = 'npwd:retweetExists',
  RETWEET_FAILURE = 'npwd:retweetFailed',
  REPORT = 'npwd:reportTweet',
  REPORT_SUCCESS = 'npwd:reportTweetSuccess',
  REPORT_FAILURE = 'npwd:reportTweetFailed',
}
