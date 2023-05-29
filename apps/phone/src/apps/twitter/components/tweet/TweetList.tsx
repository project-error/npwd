import { memo, useCallback, useState } from 'react';
import Tweet from './Tweet';
import { Virtuoso } from 'react-virtuoso';
import { FormattedTweet, GetTweet, TwitterEvents } from '@typings/twitter';
import Backdrop from '@ui/components/Backdrop';
import { ServerPromiseResp } from '@typings/common';
import fetchNui from '@utils/fetchNui';
import { processTweet } from '@apps/twitter/utils/tweets';
import { usePhone } from '@os/phone/hooks';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

export function TweetList({ tweets }: { tweets: FormattedTweet[] }) {
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const TWEET_LIMIT_PER_PAGE  = ResourceConfig?.twitter?.resultsLimit || 25;
  const [imageOpen, setImageOpen] = useState<string | null>(null);
  const [tweetsData, setTweetsData] = useState(tweets);
  const [hasNextPage, setHasNextPage] = useState(tweetsData.length == TWEET_LIMIT_PER_PAGE ? true : false);
  const [page, setPage] = useState(0);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const handleNewPageLoad = useCallback(() => {
    if (isNextPageLoading || !hasNextPage) return;
    setIsNextPageLoading(true);

    const pageId = page + 1
    fetchNui<ServerPromiseResp<GetTweet[]>>(TwitterEvents.FETCH_TWEETS, {pageId}).then((resp) => {
      if (resp.status !== 'ok') {
        addAlert({
          message: resp.errorMsg,
          type: 'error',
        });
      } else {
        const newTweets = resp.data?.map(processTweet)
        if (newTweets.length < TWEET_LIMIT_PER_PAGE) {
          setHasNextPage(false);
        }
        setTweetsData([...tweetsData, ...newTweets])
        setPage(pageId);
      }

      //Maybe a better way to do this?
      //Prevents the "250" rate limit if someone is scrolling too fast
      return setTimeout(() => { 
        setIsNextPageLoading(false);
      }, 350);

    });
  }, [addAlert, setTweetsData])

  const Footer = () => {
    if (hasNextPage) {
      return (
        <div style={{padding: '2rem', display: 'flex', justifyContent: 'center', color: '#64A5FD'}}>
          Loading Tweets...
        </div>
      );
    } else {
      return (
        <div style={{padding: '2rem', display: 'flex', justifyContent: 'center', color: '#64A5FD'}}>
          Nothing More To Load!
        </div>
      );
    }
  }

  return (
    <>
    {imageOpen && <Backdrop onClick={() => setImageOpen(null)} />}
    <Virtuoso
      style={{height: '100%'}}
      data={tweetsData}
      endReached={handleNewPageLoad}
      overscan={6}
      itemContent={(index, tweet) => {
        return <Tweet key={tweet.id} tweet={tweet} imageOpen={imageOpen} setImageOpen={setImageOpen} />
      }}
      components={{ Footer }}
    />
    </>
  );
}

export default memo(TweetList); // only re-render if our tweets change
