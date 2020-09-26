import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MuiAvatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ReplyIcon from "@material-ui/icons/Reply";
import QuoteIcon from "@material-ui/icons/FormatQuote";

import { ListItem } from "../../../ui/components/ListItem";
import { secondsToHumanReadable } from "../utils/time";
import ImageDisplay from "./ImageDisplay";
import Avatar from "./Avatar";

const useStyles = makeStyles(() => ({
  root: {
    overflowX: "hidden",
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "flex-start",
    width: "100%",
  },
  content: {
    display: "flex",
    marginTop: "-10px", // easier to do this here than override the MUI styles
    flexFlow: "column nowrap",
    width: "100%",
  },
  date: {
    marginLeft: "10px",
  },
  buttonContainer: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    width: "100%",
    marginLeft: "-20px", // easier to do this here than override the MUI styles
  },
}));

export const Tweet = (tweet) => {
  const {
    message,
    images,
    avatar_url,
    profile_name,
    seconds_since_tweet,
  } = tweet;
  const classes = useStyles();
  const { t } = useTranslation();

  const Message = () => (
    <>
      <div>{message}</div>
      <ImageDisplay visible images={images} small />
    </>
  );

  const Primary = () => (
    <>
      <strong>{`@${profile_name}`}</strong>
      <Typography
        className={classes.date}
        component="span"
        variant="body2"
        color="textSecondary"
      >
        {secondsToHumanReadable(t, seconds_since_tweet)}
      </Typography>
    </>
  );

  return (
    <ListItem className={classes.root} divider>
      <ListItemAvatar>
        <MuiAvatar>
          <Avatar avatarUrl={avatar_url} height="45px" width="45px" />
        </MuiAvatar>
      </ListItemAvatar>
      <div className={classes.content}>
        <ListItemText primary={<Primary />} secondary={<Message />} />
        <div className={classes.buttonContainer}>
          <Button>
            <ReplyIcon />
          </Button>
          <Button>
            <FavoriteBorderIcon />
          </Button>
          <Button>
            <QuoteIcon />
          </Button>
        </div>
      </div>
    </ListItem>
  );
};

export default Tweet;
