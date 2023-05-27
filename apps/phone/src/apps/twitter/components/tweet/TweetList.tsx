import { memo, useState } from 'react';

import { List } from '@ui/components/List';
import Tweet from './Tweet';
import { FormattedTweet } from '@typings/twitter';
import Backdrop from '@ui/components/Backdrop';

export function TweetList({ tweets }: { tweets: FormattedTweet[] }) {
  const [imageOpen, setImageOpen] = useState<string | null>(null);

  return (
    <>  
      {imageOpen && <Backdrop onClick={() => setImageOpen(null)} />}
      <List>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} imageOpen={imageOpen} setImageOpen={setImageOpen} />
        ))}
      </List>
    </>
  );
}

export default memo(TweetList); // only re-render if our tweets change
