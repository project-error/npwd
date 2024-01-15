import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTwitterActions } from '@apps/twitter/hooks/useTwitterActions';
import { NPWDButton } from '@npwd/keyos';
import { Heart } from 'lucide-react';

function LikeButton({ tweetId, isLiked, likes }) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const { localToggleLike } = useTwitterActions();

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
      localToggleLike(tweetId);
    });
  };

  if (loading) {
    return (
      <NPWDButton disabled size="sm" variant="ghost">
        <CircularProgress size={22} />
      </NPWDButton>
    );
  }

  return (
    <NPWDButton size="sm" variant="ghost" onClick={handleClick} className="space-x-2">
      <span>
        {liked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-sky-400"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        ) : (
          <Heart className="text-sky-400" size={20} />
        )}
      </span>
      {likes > 0 && <p className="text-neutral-900 dark:text-white">{likes}</p>}
    </NPWDButton>
  );
}

export default LikeButton;
