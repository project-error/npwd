import React, { memo, useState } from 'react';
import xss from 'xss';
import { useTranslation } from 'react-i18next';
import { ListItemAvatar, Avatar as MuiAvatar } from '@mui/material';

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
import {
  TweetContent,
  TweetContentPrimary,
  TweetDate,
  TweetItemContainer,
} from './Tweet.styles';

interface TweetProps {
  tweet: FormattedTweet;
  setImageOpen: (val: string | null) => void;
  imageOpen: string | null;
}

export const Tweet: React.FC<TweetProps> = ({ tweet, imageOpen, setImageOpen }) => {
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

  // this is a workaround to transfer string new lines and returns that
  // are stored into the database into html for the UI to render

  // We are replacing with <br /> to eventually render in HTML
  const formattedMessage = message.replace(/\n\r?/g, '<br />');

  // Therefore we need to sanitize this message to protect against XSS
  const sanitizedMessage = xss(formattedMessage, {
    // Be as strict as possible, whitelisting <br> tag
    whiteList: {
      br: [],
    },
  });

  const profileName = isRetweet ? retweetProfileName : profile_name;
  const formattedProfileName = profileName ? `@${profileName}` : '';

  const avatarUrl = isRetweet ? retweetAvatarUrl : avatar_url;

  return (
    <li className="flex w-full flex-col flex-nowrap overflow-x-hidden px-2 pt-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
      {isRetweet && <Retweet profileName={profile_name} />}
      <TweetItemContainer>
        {enableAvatars && (
          <ListItemAvatar>
            <MuiAvatar>
              <Avatar avatarUrl={avatarUrl} height="40px" width="40px" />
            </MuiAvatar>
          </ListItemAvatar>
        )}
        <TweetContent>
          <TweetContentPrimary>
            <p className='text-sky-400 text-base font-bold'>{formattedProfileName}</p>
            <TweetDate variant="body2" color="textSecondary">
              {secondsToHumanReadable(t, seconds_since_tweet)}
            </TweetDate>
          </TweetContentPrimary>
          <p
            className="text-sm text-neutral-900 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: sanitizedMessage,
            }}
          />
          {enableImages && <ImageDisplay visible images={images} />}
          <div className='flex flex-nowrap flex-row justify-between w-full mt-4'>
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
