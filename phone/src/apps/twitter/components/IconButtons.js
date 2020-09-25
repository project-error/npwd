import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import EmojiIcon from "@material-ui/icons/SentimentSatisfied";

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

export const IconButtons = ({ onMediaClick, onEmojiClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.buttons}>
      <Button className={classes.button} onClick={onMediaClick}>
        <InsertPhotoIcon color="action" />
      </Button>
      <Button className={classes.button} onClick={onEmojiClick}>
        <EmojiIcon color="action" />
      </Button>
    </div>
  );
};

export default IconButtons;
