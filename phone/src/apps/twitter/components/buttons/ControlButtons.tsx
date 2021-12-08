import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { Button } from '@mui/material';
import { StatusButton } from '@ui/components/StatusButton';

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
  const [t] = useTranslation();

  const imagePromptVisible = showImagePrompt && !showEmoji;
  const primaryButtonText = imagePromptVisible ? t('TWITTER.SUBMIT_IMAGE') : t('TWITTER.TWEET');
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
          {t('GENERIC.CLOSE')}
        </StatusButton>
      )}
    </div>
  );
};

export default ControlButtons;
