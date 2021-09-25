import React, { memo } from 'react';
import { Picker } from 'emoji-mart';
import { useTheme } from '@mui/material';

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Picker onClick={onEmojiClick} set="google" theme={theme.palette.mode} showPreview={false} />
  );
};

export default memo(EmojiSelect); // The picker is an expensive render
