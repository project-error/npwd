import React, { memo } from 'react';
import data from 'emoji-mart/data/google.json';

import { NimblePicker } from 'emoji-mart';
import { useTheme } from '@mui/material';

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <NimblePicker
      data={data}
      onClick={onEmojiClick}
      set="google"
      theme={theme.palette.mode}
      showPreview={false}
    />
  );
};

export default memo(EmojiSelect); // The picker is an expensive render
