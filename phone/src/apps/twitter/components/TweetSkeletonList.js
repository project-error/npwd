import React from "react";

import { List } from "../../../ui/components/List";
import TweetSkeleton from "./TweetSkeleton";

export function TweetSkeletonList() {
  return (
    <List>
      {new Array(10).map(() => (
        <TweetSkeleton />
      ))}
    </List>
  );
}

export default TweetSkeletonList;
