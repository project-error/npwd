import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { TwitterEvents } from '../../../../../../typings/twitter';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

const LOADING_TIME = 1250;

function LikeButton({ tweetId, isLiked }) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();

  const handleClick = () => {
    fetchNui<ServerPromiseResp<void>>(TwitterEvents.TOGGLE_LIKE, { tweetId }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_TWITTER_LIKE_TWEET_FAILED'),
          type: 'error',
        });
      }

      setLoading(true);
      window.setTimeout(() => {
        setLiked(!liked);
        setLoading(false);
      }, LOADING_TIME);
    });
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
