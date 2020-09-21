import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Picker } from "emoji-mart";

import "./emoji.css";
import "emoji-mart/css/emoji-mart.css";

const useStyles = makeStyles((theme) => ({
  emojiPicker: {
    background: "none",
    border: "none",
    boxShadow: "none",
  },
}));

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  const classes = useStyles();

  if (!visible) return null;

  return (
    <Picker
      className={classes.emojiPicker}
      onClick={onEmojiClick}
      set="google"
      includes={["smileys"]}
      theme="dark"
      showPreview={false}
    />
  );
};

export default memo(EmojiSelect); // The picker is an expensive render
