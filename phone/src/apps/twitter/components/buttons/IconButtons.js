import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import EmojiIcon from "@material-ui/icons/SentimentSatisfied";
import { usePhone } from "../../../../os/phone/hooks/usePhone";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
    paddingLeft: "5px", // re-align left buttons after overriding material-ui spacing
  },
  button: {
    background: "transparent",
    minWidth: "45px", // override default material-ui spacing between buttons
  },
}));

export const IconButtons = ({ onImageClick, onEmojiClick }) => {
  const classes = useStyles();
  const { config } = usePhone();
  
  if (!config) return null;
  const { enableImages, enableEmojis } = config.twitter;

  return (
    <div className={classes.buttons}>
      {enableImages && (<Button className={classes.button} onClick={onImageClick}>
        <InsertPhotoIcon color="action" />
      </Button>)}
      {enableEmojis && (<Button className={classes.button} onClick={onEmojiClick}>
        <EmojiIcon color="action" />
      </Button>)}
    </div>
  );
};

export default IconButtons;
