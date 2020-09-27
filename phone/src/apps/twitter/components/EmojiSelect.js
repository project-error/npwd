import React, { memo } from "react";
import { Picker } from "emoji-mart";

import "./emoji.css";
import "emoji-mart/css/emoji-mart.css";

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  if (!visible) return null;

  return (
    <Picker
      onClick={onEmojiClick}
      set="google"
      theme="dark"
      showPreview={false}
    />
  );
};

export default memo(EmojiSelect); // The picker is an expensive render
