import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { TwitterEvents } from '../../../../../../typings/twitter';

const LOADING_TIME = 1250;

function LikeButton({ tweetId, isLiked }) {
  const Nui = useNuiRequest();
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    Nui.send(TwitterEvents.TOGGLE_LIKE, tweetId);
    setLoading(true);
    window.setTimeout(() => {
      setLiked(!liked);
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

  return (
    <Button onClick={handleClick}>
      {liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
    </Button>
  );
}

export default LikeButton;
