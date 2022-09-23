import React, { useState } from 'react';
import { Button, CircularProgress, Icon, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { Box } from '@mui/material/node_modules/@mui/system';
import { styled, lighten } from '@mui/material/styles';

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2px',
  alignItems: 'center',
  padding: '2px',
  paddingRight: '5px',
  paddingLeft: '5px',
  cursor: 'pointer',
  borderRadius: 8,
  transition: '0.2s',
  ':hover': {
    background: lighten(theme.palette.background.paper, 0.1),
  },
}));

function LikeButton({ tweetId, isLiked, likes }) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();

  const handleClick = () => {
    setLoading(true);
    fetchNui<ServerPromiseResp<void>>(TwitterEvents.TOGGLE_LIKE, { tweetId }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('TWITTER.FEEDBACK.LIKE_TWEET_FAILED'),
          type: 'error',
        });
      }

      setLoading(false);
      setLiked(!liked);
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
    <Button
      onClick={handleClick}
      startIcon={liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
    >
      <Typography color="#bfbfbf" fontSize="16px">
        {likes}
      </Typography>
    </Button>
  );
}

export default LikeButton;
