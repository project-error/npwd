import React from "react";

import { List } from "../../../../ui/components/List";
import Tweet from "./Tweet";
import TweetSkeletonList from "./TweetSkeletonList";

export function TweetList({ tweets }) {
  if (!tweets) return <TweetSkeletonList />;
  return (
    <List>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </List>
  );
}

export default TweetList;
