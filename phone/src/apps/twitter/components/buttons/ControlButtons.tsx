import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { Button } from '@mui/material';
import { StatusButton } from '../../../../ui/components/StatusButton';

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-end',
    alignItems: 'justify-content',
    marginRight: '15px',
  },
  close: {
    marginLeft: '8px',
  },
}));

export const ControlButtons = ({ showImagePrompt, showEmoji, onCloseClick, onPrimaryClick }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const imagePromptVisible = showImagePrompt && !showEmoji;
  const primaryButtonText = imagePromptVisible
    ? t('APPS_TWITTER_SUBMIT_IMAGE')
    : t('APPS_TWITTER_TWEET');
  const showCloseButton = showImagePrompt || showEmoji;

  return (
    <div className={classes.buttons}>
      <Button variant="contained" color="primary" onClick={onPrimaryClick}>
        {primaryButtonText}
      </Button>
      {showCloseButton && (
        <StatusButton
          className={classes.close}
          variant="contained"
          color="error"
          onClick={onCloseClick}
        >
          {t('APPS_TWITTER_CLOSE_IMAGE')}
        </StatusButton>
      )}
    </div>
  );
};

export default ControlButtons;
