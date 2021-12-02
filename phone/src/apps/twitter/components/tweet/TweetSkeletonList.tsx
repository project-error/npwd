import React from 'react';

import { List } from '@ui/components/List';
import TweetSkeleton from './TweetSkeleton';

export function TweetSkeletonList() {
  return (
    <List>
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
    </List>
  );
}

export default TweetSkeletonList;
