import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

function ReportButton({ handleClose, tweetId, isReported }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { addAlert } = useSnackbar();

  const handleClick = () => {
    setLoading(true);

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.REPORT, { tweetId }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('TWITTER.FEEDBACK.REPORT_TWEET_FAILED'),
          type: 'error',
        });
      }

      setLoading(false);
      handleClose();

      addAlert({
        message: t('TWITTER.FEEDBACK.REPORT_TWEET_SUCCESS'),
        type: 'success',
      });
    });
  };

  if (isReported) {
    return (
      <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-white/10" onClick={handleClose}>
        <Check size={18} />
        <span>{t('TWITTER.REPORTED')}</span>
      </button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 py-2">
        <LoadingSpinner height={22} className="[&>div]:size-[22px]" />
      </div>
    );
  }

  return (
    <button type="button" className="w-full px-4 py-2 text-left text-sm hover:bg-white/10" onClick={handleClick}>
      {t('TWITTER.REPORT')}
    </button>
  );
}

export default ReportButton;
