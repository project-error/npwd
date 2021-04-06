import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, MenuItem } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { TwitterEvents } from '../../../../../../typings/twitter';

const LOADING_TIME = 1250;

function ReportButton({ handleClose, tweetId, isReported }) {
  const Nui = useNuiRequest();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    Nui.send(TwitterEvents.REPORT, tweetId);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      handleClose();
    }, LOADING_TIME);
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
