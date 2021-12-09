import React from 'react';
import TweetList from './TweetList';
import { useTweetsValue } from '../../hooks/state';
import TweetSkeletonList from './TweetSkeletonList';

export function TweetListContainer() {
  const tweets = useTweetsValue();

  return (
    <React.Suspense fallback={<TweetSkeletonList />}>
      <TweetList tweets={tweets} />
    </React.Suspense>
  );
}

export default TweetListContainer;
