import React, { useEffect, useState, memo, useCallback } from 'react';

import { List } from '../../../../ui/components/List';
import Tweet from './Tweet';
import TweetSkeletonList from './TweetSkeletonList';
import { Tweet as ITweet, TwitterEvents } from '../../../../../../typings/twitter';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { processTweet } from '../../utils/tweets';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { CircularProgress } from '@mui/material';

const MINIMUM_LOAD_TIME = 700;

export function TweetList({ tweets }: { tweets: ITweet[] }) {
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!tweets.length);

  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const { updateTweets } = useTwitterActions();

  const handleNextTweets = async () => {
    fetchNui<ServerPromiseResp<ITweet[]>>(TwitterEvents.FETCH_TWEETS, { pageId: page }).then(
      (resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            type: 'error',
            message: t('APPS_TWITTER_FETCH_TWEETS_FAILED'),
          });
        }

        if (resp.data.length === 0) {
          setHasMore(false);
          return;
        }

        setHasMore(true);
        setPage((curVal) => curVal + 1);

        console.log('new tewwweeeeeettts', resp.data);

        updateTweets(resp.data.map(processTweet));
      },
    );
  };

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
      <InfiniteScroll
        next={handleNextTweets}
        hasMore={hasMore}
        loader={<CircularProgress />}
        dataLength={tweets.length}
      >
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </List>
  );
}

export default memo(TweetList); // only re-render if our tweets change
