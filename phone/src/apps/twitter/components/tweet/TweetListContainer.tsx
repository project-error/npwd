import React, { useEffect } from 'react';

import Nui from '../../../../os/nui-events/utils/Nui';
import { useTweets } from '../../hooks/useTweets';
import { useTwitterNotifications } from '../../hooks/useTwitterNotifications';
import TweetList from './TweetList';
import { TwitterEvents } from '../../../../../../typings/twitter';

export function TweetListContainer() {
  const { tweets } = useTweets();
  const { setUnreadCount } = useTwitterNotifications();

  useEffect(() => {
    Nui.send(TwitterEvents.FETCH_TWEETS, {});
  }, []);

  useEffect(() => {
    if (tweets?.length) {
      setUnreadCount(0);
    }
  }, [setUnreadCount, tweets]);

  return <TweetList tweets={tweets} />;
}

export default TweetListContainer;
