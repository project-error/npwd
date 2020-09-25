import React, { useEffect } from "react";

import Nui from "../../../os/nui-events/utils/Nui";
import { List } from "../../../ui/components/List";
import { useTweets } from "../hooks/useTweets";
import Tweet from "./Tweet";

const TWEETS_REFRESH_RATE = 5000;

export function TweetList() {
  const { tweets } = useTweets();

  useEffect(() => {
    Nui.send("phone:fetchTweets", {});
    const timeout = window.setTimeout(() => {
      Nui.send("phone:fetchTweets", {});
    }, TWEETS_REFRESH_RATE);
    return () => window.clearTimeout(timeout);
  }, []);

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
