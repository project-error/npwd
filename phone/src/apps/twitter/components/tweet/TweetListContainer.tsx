import React, { useEffect } from 'react';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useTweets } from '../../hooks/useTweets';
import { useTwitterNotifications } from '../../hooks/useTwitterNotifications';
import TweetList from './TweetList';
import { TwitterEvents } from '../../../../../../typings/twitter';

export function TweetListContainer() {
  const Nui = useNuiRequest();
  const { tweets } = useTweets();
  const { setUnreadCount } = useTwitterNotifications();

  useEffect(() => {
    Nui.send(TwitterEvents.FETCH_TWEETS, {});
  }, [Nui]);

  useEffect(() => {
    if (tweets?.length) {
      setUnreadCount(0);
    }
  }, [setUnreadCount, tweets]);

  return <TweetList tweets={tweets} />;
}

export default TweetListContainer;
