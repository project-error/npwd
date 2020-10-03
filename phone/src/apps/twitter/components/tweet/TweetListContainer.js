import React from "react";

import { useTweets } from "../../hooks/useTweets";
import TweetList from "./TweetList";

export function TweetListContainer() {
  const { tweets } = useTweets();
  return <TweetList tweets={tweets} />;
}

export default TweetListContainer;
