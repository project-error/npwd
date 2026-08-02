import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhone } from '@os/phone/hooks/usePhone';
import ReportButton from '../buttons/ReportButton';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { NPWDButton } from '@npwd/keyos';
import { MoreVertical } from 'lucide-react';

export const ShowMore = ({ id, isReported, isMine }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const { deleteTweet } = useTwitterActions();

  if (!ResourceConfig) return null;

  const handleClick = () => {
    setOpen((current) => !current);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteTweet = () => {
    fetchNui<ServerPromiseResp<void>>(TwitterEvents.DELETE_TWEET, { tweetId: id }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('TWITTER.FEEDBACK.DELETE_TWEET_FAILED'),
          type: 'error',
        });
      }

      handleClose();
    });
  };

  const allowedToDelete = ResourceConfig.twitter.allowDeleteTweets && isMine;
  const allowedToReport = ResourceConfig.twitter.allowReportTweets && !isMine;
  const hasActions = allowedToDelete || allowedToReport;

  return (
    <div ref={containerRef} className="relative mr-[15px]">
      <NPWDButton
        aria-controls="tweet-actions-menu"
        aria-haspopup="true"
        size="sm"
        variant="ghost"
        onClick={hasActions ? handleClick : undefined}
        disabled={!hasActions}
      >
        <MoreVertical size={20} className="text-sky-400" />
      </NPWDButton>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />
          <div
            id="tweet-actions-menu"
            className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-md border border-white/10 bg-[#121212] py-1 text-keyos-cream shadow-lg"
          >
            {allowedToDelete && (
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-white/10"
                onClick={handleDeleteTweet}
              >
                {t('GENERIC.DELETE')}
              </button>
            )}
            {allowedToReport && (
              <ReportButton handleClose={handleClose} isReported={isReported} tweetId={id} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowMore;
