import React, { memo } from 'react';
import { Picker } from 'emoji-mart';
import { useTheme } from '@material-ui/core';

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Picker onClick={onEmojiClick} set="google" theme={theme.palette.type} showPreview={false} />
  );
};

export default memo(EmojiSelect); // The picker is an expensive render
