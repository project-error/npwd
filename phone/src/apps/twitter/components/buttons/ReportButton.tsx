import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, MenuItem } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { TwitterEvents } from '../../../../../../typings/twitter';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';

const LOADING_TIME = 1250;

function ReportButton({ handleClose, tweetId, isReported }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { addAlert } = useSnackbar();

  const handleClick = () => {
    setLoading(true);

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.REPORT, { tweetId }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_TWITTER_REPORT_TWEET_FAILED'),
          type: 'error',
        });
      }

      setLoading(false);
      handleClose();

      addAlert({
        message: t('APPS_TWITTER_REPORT_TWEET_SUCCESS'),
        type: 'success',
      });
    });
  };

  if (isReported) {
    return (
      <MenuItem onClick={handleClose}>
        <DoneIcon />
        <span style={{ marginLeft: '5px' }}>{t('APPS_TWITTER_REPORTED')}</span>
      </MenuItem>
    );
  }

  if (loading) {
    return (
      <Button disabled>
        <CircularProgress id="twitter-report-progress" size={22} />
      </Button>
    );
  }

  return <MenuItem onClick={handleClick}>{t('APPS_TWITTER_REPORT')}</MenuItem>;
}

export default ReportButton;
