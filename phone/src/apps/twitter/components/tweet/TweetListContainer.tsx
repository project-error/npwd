import React, { useEffect } from 'react';
import TweetList from './TweetList';
import { Tweet, TwitterEvents } from '../../../../../../typings/twitter';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { processTweet } from '../../utils/tweets';
import { useTweetsState } from '../../hooks/state';

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

  return <TweetList tweets={tweets} />;
}

export default TweetListContainer;
