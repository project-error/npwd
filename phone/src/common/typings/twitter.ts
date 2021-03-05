export interface Tweet {
  id: number;
  profile_name?: string;
  profile_id: number;
  isMine: boolean;
  isReported: boolean;
  avatar_url?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  images?: string;
  likes?: number;
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

export enum TwitterNetEvents {
  FETCH_TWEETS = 'phone:fetchTweets',
  FETCH_TWEETS_SUCCESS = 'fetchTweets',
  FETCH_TWEETS_FAILURE = 'fetchTweetsFailed',
  FETCH_TWEETS_FILTERED = 'phone:fetchTweetsFiltered',
  FETCH_TWEETS_FILTERED_SUCCESS = 'fetchTweetsFiltered',
  FETCH_TWEETS_FILTERED_FAILURE = 'fetchTweetsFilteredFailed',
  GET_OR_CREATE_PROFILE = 'phone:getOrCreateTwitterProfile',
  GET_OR_CREATE_PROFILE_SUCCESS = 'getOrCreateTwitterProfile',
  GET_OR_CREATE_PROFILE_FAILURE = 'getOrCreateTwitterProfileFailed',
  UPDATE_PROFILE = 'phone:updateTwitterProfile',
  UPDATE_PROFILE_LOADING = 'updateProfileLoading',
  UPDATE_PROFILE_RESULT = 'updateProfileResult',
  CREATE_TWEET = 'phone:createTweet',
  CREATE_TWEET_LOADING = 'createTweetLoading',
  CREATE_TWEET_RESULT = 'createTweetResult',
  CREATE_TWEET_BROADCAST = 'createTweetBroadcast',
  CREATE_TWEET_FAILURE = 'createTweetResultFailed',
  DELETE_TWEET = 'phone:deleteTweet',
  DELETE_TWEET_SUCCESS = 'deleteTweetSuccess',
  DELETE_TWEET_FAILURE = 'deleteTweetFailed',
  TOGGLE_LIKE = 'phone:toggleLike',
  TOGGLE_LIKE_SUCCESS = 'toggleLikeSuccess',
  TOGGLE_LIKE_FAILURE = 'toggleLikeFailed',
  REPORT = 'phone:reportTweet',
  REPORT_SUCCESS = 'reportTweetSuccess',
  REPORT_FAILURE = 'reportTweetFailed',
}
