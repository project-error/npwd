import React, { useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import Nui from '../../../../os/nui-events/utils/Nui';

const LOADING_TIME = 1250;

function LikeButton({ tweetId, isLiked }) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    Nui.send('phone:toggleLike', tweetId);
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
      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </Button>
  );
}

export default LikeButton;
