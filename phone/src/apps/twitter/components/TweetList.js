import React from "react";

import { List } from "../../../ui/components/List";
import { useTweets } from "../hooks/useTweets";
import Tweet from "./Tweet";

export function TweetList() {
  const { tweets } = useTweets();
  console.log(tweets);
  return (
    <List>
      {tweets
        .filter((t) => t.visible)
        .map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
    </List>
  );
}

export default TweetList;
