import { memo, useState } from 'react';

import { List } from '@ui/components/List';
import Tweet from './Tweet';
import { FormattedTweet, TwitterEvents, GetTweet } from '@typings/twitter';
import Backdrop from '@ui/components/Backdrop';
import InfiniteScroll from 'react-infinite-scroll-component'
import { ServerPromiseResp } from '@typings/common';
import fetchNui from '@utils/fetchNui';
import { processTweet } from '@apps/twitter/utils/tweets';

export function TweetList({ tweets }: { tweets: FormattedTweet[] }) {
  const [imageOpen, setImageOpen] = useState<string | null>(null);
  
  const [tweetsData, setTweetsData] = useState(tweets);
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState((tweetsData.length >= 20 ? true : false))

  const loadmore = () => {
    setHasMore(false);
    const pageId = page + 1;
    fetchNui<ServerPromiseResp<GetTweet[]>>(TwitterEvents.FETCH_TWEETS, {pageId}).then((resp) => {
      if (resp.status !== 'ok') {
        return console.log(resp.errorMsg || '')
      } else {
        const newTweets = resp.data?.map(processTweet)
        if (newTweets.length > 0) {
          setPage(pageId);
          setTweetsData(tweetsData.concat(newTweets));
          setHasMore((newTweets.length >= 20 ? true : false))
        }
      }
    });
  }

  return (
    <>
      <InfiniteScroll dataLength={tweetsData.length} next={loadmore} hasMore={hasMore} height={600} loader={<h4>Loading...</h4>}>
        {imageOpen && <Backdrop onClick={() => setImageOpen(null)} />}
        <List>
          {tweetsData.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} imageOpen={imageOpen} setImageOpen={setImageOpen} />
          ))}
        </List>
      </InfiniteScroll>
    </>
  );
}

export default memo(TweetList); // only re-render if our tweets change
