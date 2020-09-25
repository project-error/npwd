import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ReplyIcon from "@material-ui/icons/Reply";
import QuoteIcon from "@material-ui/icons/FormatQuote";

import { ListItem } from "../../../ui/components/ListItem";
import ImageDisplay from "./ImageDisplay";

const useStyles = makeStyles(() => ({
  root: {
    overflowX: "hidden",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "flex-start",
    width: "100%",
  },
  text: {
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
  },
}));

export const Tweet = (tweet) => {
  const { message, images } = tweet;
  const classes = useStyles();

  return (
    <ListItem className={classes.root} divider>
      <ListItemText className={classes.text} primary={message} />
      <ImageDisplay visible images={images} small />
      <div className={classes.buttonContainer}>
        <Button>
          <FavoriteBorderIcon />
        </Button>
        <Button>
          <ReplyIcon />
        </Button>
        <Button>
          <QuoteIcon />
        </Button>
      </div>
    </ListItem>
  );
};

export default Tweet;
