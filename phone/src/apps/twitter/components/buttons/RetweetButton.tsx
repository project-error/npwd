import React, { useState } from 'react';
import { CircularProgress, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { Repeat } from '@mui/icons-material';
import { TwitterEvents } from '../../../../../../typings/twitter';

interface IProps {
  tweetId: number;
  retweetId: string;
  isRetweet: boolean | number;
}

const useStyles = makeStyles((theme) => ({
  iconFilled: {
    color: theme.palette.primary.main,
  },
}));

const LOADING_TIME = 1250;

export const RetweetButton = ({ tweetId, isRetweet, retweetId }: IProps) => {
  const Nui = useNuiRequest();
  const [retweeted, setRetweeted] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleClick = () => {
    // don't allow someone to spam retweet
    // note that this is enforced by the server currently, not the UI
    // so if a player refreshes the page they won't see the filled
    // button anymore
    if (retweeted) return;

    // if someone is retweeting something that is itself a retweet
    // then we want to retweet the original post (if we haven't already)
    const idToRetweet = isRetweet ? retweetId : tweetId;
    Nui.send(TwitterEvents.RETWEET, idToRetweet);
    setLoading(true);
    window.setTimeout(() => {
      setRetweeted(true);
      setLoading(false);
    }, LOADING_TIME);
  };

  if (loading) {
    return (
      <Button disabled>
        <CircularProgress size={22} />
      </Button>
    );
  }

  const className = retweeted ? classes.iconFilled : '';

  return (
    <Button onClick={handleClick}>
      <Repeat className={className} />
    </Button>
  );
};

export default RetweetButton;
