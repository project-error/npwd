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
  FETCH_TWEETS_SUCCESS = 'fetchTweets',
  FETCH_TWEETS_FAILURE = 'fetchTweetsFailed',
  FETCH_TWEETS_FILTERED = 'npwd:fetchTweetsFiltered',
  FETCH_TWEETS_FILTERED_SUCCESS = 'fetchTweetsFiltered',
  FETCH_TWEETS_FILTERED_FAILURE = 'fetchTweetsFilteredFailed',
  CREATE_PROFILE = 'npwd:createTwitterProfile',
  CREATE_PROFILE_RESULT = 'npwd:createProfileResult',
  GET_OR_CREATE_PROFILE = 'npwd:getOrCreateTwitterProfile',
  GET_OR_CREATE_PROFILE_NULL = 'getOrCreateTwitterProfileNull',
  GET_OR_CREATE_PROFILE_SUCCESS = 'getOrCreateTwitterProfile',
  GET_OR_CREATE_PROFILE_FAILURE = 'getOrCreateTwitterProfileFailed',
  UPDATE_PROFILE = 'npwd:updateTwitterProfile',
  UPDATE_PROFILE_LOADING = 'updateProfileLoading',
  UPDATE_PROFILE_RESULT = 'updateProfileResult',
  CREATE_TWEET = 'npwd:createTweet',
  CREATE_TWEET_LOADING = 'createTweetLoading',
  CREATE_TWEET_RESULT = 'createTweetResult',
  CREATE_TWEET_BROADCAST = 'createTweetBroadcast',
  CREATE_TWEET_FAILURE = 'createTweetResultFailed',
  DELETE_TWEET = 'npwd:deleteTweet',
  DELETE_TWEET_SUCCESS = 'deleteTweetSuccess',
  DELETE_TWEET_FAILURE = 'deleteTweetFailed',
  TOGGLE_LIKE = 'npwd:toggleLike',
  TOGGLE_LIKE_SUCCESS = 'toggleLikeSuccess',
  TOGGLE_LIKE_FAILURE = 'toggleLikeFailed',
  RETWEET = 'npwd:retweet',
  RETWEET_SUCCESS = 'npwd:retweetSuccess',
  RETWEET_EXISTS = 'npwd:retweetExists',
  RETWEET_FAILURE = 'npwd:retweetFailed',
  REPORT = 'npwd:reportTweet',
  REPORT_SUCCESS = 'reportTweetSuccess',
  REPORT_FAILURE = 'reportTweetFailed',
}
