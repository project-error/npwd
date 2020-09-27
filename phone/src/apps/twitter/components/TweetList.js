import React from "react";

import { List } from "../../../ui/components/List";
import Tweet from "./Tweet";

export function TweetList({ tweets }) {
  return (
    <List>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </List>
  );
}

export default TweetList;
