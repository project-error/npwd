import React, { memo } from 'react';
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
  TweetButtonContainer,
  TweetContent,
  TweetContentPrimary,
  TweetDate,
  TweetItem,
  TweetItemContainer,
  TweetMessage,
  TweetProfile,
} from './Tweet.styles';

export const Tweet = (tweet: FormattedTweet) => {
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
    <TweetItem divider>
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
            <TweetProfile>{formattedProfileName}</TweetProfile>
            <TweetDate variant="body2" color="textSecondary">
              {secondsToHumanReadable(t, seconds_since_tweet)}
            </TweetDate>
          </TweetContentPrimary>
          <TweetMessage
            dangerouslySetInnerHTML={{
              __html: sanitizedMessage,
            }}
          />
          {enableImages && <ImageDisplay visible images={images} small />}
          <TweetButtonContainer>
            <ReplyButton profile_name={profile_name} />
            <LikeButton likes={likes} tweetId={id} isLiked={isLiked} />
            {ResourceConfig.twitter.allowRetweet && !isMine && (
              <RetweetButton tweetId={id} retweetId={retweetId} isRetweet={isRetweet} />
            )}
            <ShowMore isMine={isMine} isReported={isReported} id={id} />
          </TweetButtonContainer>
        </TweetContent>
      </TweetItemContainer>
    </TweetItem>
  );
};

export default memo(Tweet);
