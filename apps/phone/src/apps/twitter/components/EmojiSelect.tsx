import React, { memo } from 'react';
import data from 'emoji-mart/data/google.json';
import { NimblePicker } from 'emoji-mart';

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  if (!visible) return null;

  return (
    <NimblePicker
      data={data}
      onClick={onEmojiClick}
      set="google"
      theme="dark"
      showPreview={false}
    />
  );
};

export default memo(EmojiSelect);
