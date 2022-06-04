import React, { memo } from 'react';
import { Box, Button, styled } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EmojiIcon from '@mui/icons-material/SentimentSatisfied';
import { usePhone } from '@os/phone/hooks/usePhone';

const ButtonContainer = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  paddingLeft: '5px',
});

const ButtonWrapper = styled(Button)({
  background: 'transparent',
  minWidth: '45px',
});

export const IconButtons = ({ onImageClick, onEmojiClick }) => {
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig) return null;
  const { enableImages, enableEmojis } = ResourceConfig.twitter;

  return (
    <ButtonContainer>
      {enableImages && (
        <ButtonWrapper onClick={onImageClick}>
          <InsertPhotoIcon color="action" />
        </ButtonWrapper>
      )}
    </ButtonContainer>
  );
};

export default memo(IconButtons);
