import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, styled } from '@mui/material';
import { StatusButton } from '@ui/components/StatusButton';

const ButtonsContainer = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-end',
  alignItems: 'justify-content',
  marginRight: '15px',
});

export const ControlButtons = ({ showImagePrompt, showEmoji, onCloseClick, onPrimaryClick }) => {
  const [t] = useTranslation();

  const imagePromptVisible = showImagePrompt && !showEmoji;
  const primaryButtonText = imagePromptVisible ? t('TWITTER.SUBMIT_IMAGE') : t('TWITTER.TWEET');
  const showCloseButton = showImagePrompt || showEmoji;

  return (
    <ButtonsContainer>
      <Button variant="contained" color="primary" onClick={onPrimaryClick}>
        {primaryButtonText}
      </Button>
      {showCloseButton && (
        <StatusButton
          style={{ marginLeft: '8px' }}
          variant="contained"
          color="error"
          onClick={onCloseClick}
        >
          {t('GENERIC.CLOSE')}
        </StatusButton>
      )}
    </ButtonsContainer>
  );
};

export default ControlButtons;
