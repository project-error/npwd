import React, { memo } from 'react';

import { List } from '@ui/components/List';
import Tweet from './Tweet';
import { FormattedTweet } from '@typings/twitter';

export function TweetList({ tweets }: { tweets: FormattedTweet[] }) {
  /*const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(!!tweets.length);*/

  /*const { addAlert } = useSnackbar();
	const { t } = useTranslation();
	const { updateTweets } = useTwitterActions();
	*/
  /*const handleNextTweets = useCallback(() => {
		fetchNui<ServerPromiseResp<ITweet[]>>(
			TwitterEvents.FETCH_TWEETS,
			{ pageId: page },
			{
				status: 'ok',
				data: [],
				// data: MockTweets as unknown as ITweet[],
			},
		).then((resp) => {
			if (resp.status !== 'ok') {
				return addAlert({
					type: 'error',
					message: t('TWITTER.FEEDBACK.FETCH_TWEETS_FAILED'),
				});
			}
			
			if (resp.data.length === 0) {
				setHasMore(false);
				return;
			}
			
			setHasMore(true);
			setPage((curVal) => curVal + 1);
			
			updateTweets(resp.data.map(processTweet));
		});
	}, [page, updateTweets, addAlert, t]);*/

  // Remove inf scroll for now

  return (
    <List>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </List>
  );
}

export default memo(TweetList); // only re-render if our tweets change
