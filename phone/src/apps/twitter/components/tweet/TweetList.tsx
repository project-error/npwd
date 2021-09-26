import React, { useEffect, useState, memo } from 'react';

import { List } from '../../../../ui/components/List';
import Tweet from './Tweet';
import TweetSkeletonList from './TweetSkeletonList';
import { Tweet as ITweet } from '../../../../../../typings/twitter';

const MINIMUM_LOAD_TIME = 700;

export function TweetList({ tweets }: { tweets: ITweet[] }) {
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMimimumLoadPassed(true);
    }, MINIMUM_LOAD_TIME);
    return () => window.clearTimeout(timeout);
  }, []);

  // we add a minimum (but short) load time here so that
  // there isn't a quick flash of loading and immediately
  // another flash to the tweets screen.
  const hasLoaded = tweets && minimumLoadPassed;

  if (!hasLoaded) return <TweetSkeletonList />;
  return (
    <List>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </List>
  );
}

export default memo(TweetList); // only re-render if our tweets change
