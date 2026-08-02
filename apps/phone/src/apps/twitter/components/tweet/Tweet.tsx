import React, { memo } from 'react';
import xss from 'xss';
import { useTranslation } from 'react-i18next';

import { FormattedTweet } from '@typings/twitter';
import { secondsToHumanReadable } from '../../utils/time';
import LikeButton from '../buttons/LikeButton';
import ReplyButton from '../buttons/ReplyButton';
import ImageDisplay from '../images/ImageDisplay';
import Avatar from '../Avatar';
import { RetweetButton } from '../buttons/RetweetButton';
import { usePhone } from '@os/phone/hooks/usePhone';
import Retweet from './Retweet';
import ShowMore from './ShowMore';
import { TweetContent, TweetContentPrimary, TweetDate, TweetItemContainer } from './Tweet.styles.tsx';

interface TweetProps {
  tweet: FormattedTweet;
  setImageOpen: (val: string | null) => void;
  imageOpen: string | null;
}

export const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  const {
    id,
    message,
    images,
    avatar_url,
    profile_name,
    retweetProfileName,
    retweetAvatarUrl,
    retweetId,
    seconds_since_tweet,
    isLiked,
    isMine,
    isReported,
    isRetweet,
    likes,
  } = tweet;
  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig) return null;
  const { enableAvatars, enableImages } = ResourceConfig.twitter;

  const formattedMessage = message.replace(/\n\r?/g, '<br />');

  const sanitizedMessage = xss(formattedMessage, {
    whiteList: {
      br: [],
    },
  });

  const profileName = isRetweet ? retweetProfileName : profile_name;
  const formattedProfileName = profileName ? `@${profileName}` : '';

  const avatarUrl = isRetweet ? retweetAvatarUrl : avatar_url;

  return (
    <li className="flex w-full flex-col flex-nowrap overflow-x-hidden border-b border-neutral-200 px-2 pb-3 pt-6 dark:border-neutral-800">
      {isRetweet && <Retweet profileName={profile_name} />}
      <TweetItemContainer>
        {enableAvatars && (
          <div className="mr-3 shrink-0">
            <div className="size-10 overflow-hidden rounded-full">
              <Avatar avatarUrl={avatarUrl} height="40px" width="40px" />
            </div>
          </div>
        )}
        <TweetContent>
          <TweetContentPrimary>
            <p className="text-base font-bold text-sky-400">{formattedProfileName}</p>
            <TweetDate>{secondsToHumanReadable(t, seconds_since_tweet)}</TweetDate>
          </TweetContentPrimary>
          <p
            className="text-sm text-neutral-900 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: sanitizedMessage,
            }}
          />
          {enableImages && <ImageDisplay visible images={images} />}
          <div className="mt-4 flex w-full flex-row flex-nowrap justify-between">
            <ReplyButton profile_name={profile_name} />
            <LikeButton likes={likes} tweetId={id} isLiked={isLiked} />
            {ResourceConfig.twitter.allowRetweet && !isMine && (
              <RetweetButton tweetId={id} retweetId={retweetId} isRetweet={isRetweet} />
            )}
            <ShowMore isMine={isMine} isReported={isReported} id={id} />
          </div>
        </TweetContent>
      </TweetItemContainer>
    </li>
  );
};

export default memo(Tweet);
