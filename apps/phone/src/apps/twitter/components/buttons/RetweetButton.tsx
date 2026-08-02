import { useState } from 'react';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { NPWDButton } from '@npwd/keyos';
import { Repeat } from 'lucide-react';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

interface IProps {
  tweetId: number;
  retweetId: string;
  isRetweet: boolean | number;
}

const LOADING_TIME = 1250;

export const RetweetButton = ({ tweetId, isRetweet, retweetId }: IProps) => {
  const [retweeted, setRetweeted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();

  const handleClick = () => {
    if (retweeted) return;

    const idToRetweet = isRetweet ? retweetId : tweetId;
    setLoading(true);

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.RETWEET, { tweetId: idToRetweet }).then(
      (resp) => {
        if (resp.status !== 'ok') {
          setLoading(false);
          return addAlert({
            message: t(resp.errorMsg),
            type: 'error',
          });
        }

        window.setTimeout(() => {
          setRetweeted(true);
          setLoading(false);
        }, LOADING_TIME);
      },
    );
  };

  if (loading) {
    return (
      <NPWDButton disabled size="sm" variant="ghost">
        <LoadingSpinner height={22} className="[&>div]:size-[22px]" />
      </NPWDButton>
    );
  }

  return (
    <NPWDButton onClick={handleClick} size="sm" variant="ghost">
      <Repeat size={20} className="text-sky-400" />
    </NPWDButton>
  );
};

export default RetweetButton;
