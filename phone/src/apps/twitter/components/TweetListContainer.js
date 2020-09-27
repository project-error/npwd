import React from "react";

import { useTweets } from "../hooks/useTweets";
import TweetList from "./TweetList";
import TweetSkeletonList from "./TweetSkeletonList";

export function TweetListContainer() {
  const { tweets } = useTweets();
  if (1 || !tweets) return <TweetSkeletonList />;
  return <TweetList tweets={tweets} />;
}

export default TweetListContainer;
