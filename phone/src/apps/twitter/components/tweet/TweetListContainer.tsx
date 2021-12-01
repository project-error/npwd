import React, { useEffect } from 'react';
import TweetList from './TweetList';
import { Tweet, TwitterEvents } from '../../../../../../typings/twitter';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useTranslation } from 'react-i18next';
import { processTweet } from '../../utils/tweets';
import { useTweetsState } from '../../hooks/state';
import TweetSkeletonList from './TweetSkeletonList';
import { useSnackbar } from '../../../../os/snackbar/hooks/useSnackbar';

export function TweetListContainer() {
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const [tweets, setTweets] = useTweetsState();

  useEffect(() => {
    fetchNui<ServerPromiseResp<Tweet[]>>(TwitterEvents.FETCH_TWEETS, { pageId: 0 }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('APPS_TWITTER_FETCH_TWEETS_FAILED'),
        });
      }

      setTweets(resp.data.map(processTweet));
    });
  }, [addAlert, t, setTweets]);

  return (
    <React.Suspense fallback={<TweetSkeletonList />}>
      <TweetList tweets={tweets} />
    </React.Suspense>
  );
}

export default TweetListContainer;
