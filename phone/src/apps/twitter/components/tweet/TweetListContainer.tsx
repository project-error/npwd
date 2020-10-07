import React, { useEffect } from "react";

import Nui from "../../../../os/nui-events/utils/Nui";
import { useTweets } from "../../hooks/useTweets";
import TweetList from "./TweetList";

export function TweetListContainer() {
  const { tweets } = useTweets();

  useEffect(() => {
    Nui.send("phone:fetchTweets", {});
  }, []);

  return <TweetList tweets={tweets} />;
}

export default TweetListContainer;
