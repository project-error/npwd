import React, { memo } from 'react';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemAvatar, Avatar as MuiAvatar, ListItem, Typography } from '@material-ui/core';

import { Tweet as ITweet } from '../../../../common/typings/twitter';
import { secondsToHumanReadable } from '../../utils/time';
import LikeButton from '../buttons/LikeButton';
import ReplyButton from '../buttons/ReplyButton';
import ImageDisplay from '../images/ImageDisplay';
import Avatar from '../Avatar';
import { RetweetButton } from '../buttons/RetweetButton';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import Retweet from './Retweet';
import ShowMore from './ShowMore';

const useStyles = makeStyles({
  root: {
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '100%',
    marginTop: '6px',
  },
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-start',
    width: '100%',
  },
  content: {
    display: 'flex',
    marginTop: '-10px', // easier to do this here than override the MUI styles
    flexFlow: 'column nowrap',
    width: '100%',
  },
  primary: {
    display: 'flex',
    flexFlow: 'row nowrap',
    width: '100%',
    alignItems: 'flex-end',
  },
  profile: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  date: {
    marginLeft: '10px',
    fontSize: '14px',
  },
  message: {
    fontSize: '18px',
    wordBreak: 'break-all',
  },
  buttonContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: '-20px', // easier to do this here than override the MUI styles
    marginTop: '3px',
  },
});

export const Tweet = (tweet: ITweet) => {
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
    isRetweetedByPlayer,
  } = tweet;
  const classes = useStyles();
  const { t } = useTranslation();
  const { config } = usePhone();

  if (!config) return null;
  const { enableAvatars, enableImages } = config.twitter;

  // this is a workaround to transfer string new lines and returns that
  // are stored into the database into html for the UI to render

  // We are replacing with <br /> to eventually render in HTML
  const formattedMessage = message.replace(/\n\r?/g, '<br />');

  // Therefore we need to sanitize this message to protect against XSS
  const sanitizedMessage = DOMPurify.sanitize(formattedMessage, {
    // Be as strict as possible, whitelisting <br> tag
    ALLOWED_TAGS: ['br'],
  });

  const profileName = isRetweet ? retweetProfileName : profile_name;
  const formattedProfileName = profileName ? `@${profileName}` : '';

  const avatarUrl = isRetweet ? retweetAvatarUrl : avatar_url;

  return (
    <ListItem className={classes.root} divider>
      {isRetweet && <Retweet profileName={profile_name} />}
      <div className={classes.container}>
        {enableAvatars && (
          <ListItemAvatar>
            <MuiAvatar>
              <Avatar avatarUrl={avatarUrl} height="40px" width="40px" />
            </MuiAvatar>
          </ListItemAvatar>
        )}
        <div className={classes.content}>
          <div className={classes.primary}>
            <div className={classes.profile}>{formattedProfileName}</div>
            <Typography
              className={classes.date}
              component="div"
              variant="body2"
              color="textSecondary"
            >
              {secondsToHumanReadable(t, seconds_since_tweet)}
            </Typography>
          </div>
          <div
            className={classes.message}
            dangerouslySetInnerHTML={{
              __html: sanitizedMessage,
            }}
          />
          {enableImages && <ImageDisplay visible images={images} small />}
          <div className={classes.buttonContainer}>
            <ReplyButton profile_name={profile_name} />
            <LikeButton tweetId={id} isLiked={isLiked} />
            {!isMine && (
              <RetweetButton
                tweetId={id}
                retweetId={retweetId}
                isRetweet={isRetweet}
              />)}
            <ShowMore isMine={isMine} isReported={isReported} id={id} />
          </div>
        </div>
      </div>
    </ListItem>
  );
};

export default memo(Tweet);
