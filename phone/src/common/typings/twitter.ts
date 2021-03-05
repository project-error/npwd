
export interface NewTweet {
  message: string;
  images?: string;
  retweet?: number;
}

export interface Tweet extends NewTweet {
  profile_name: string;
  profile_id: number;
  id: number;
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
