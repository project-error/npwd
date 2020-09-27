import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MuiAvatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MoreIcon from "@material-ui/icons/MoreVert";

import { ListItem } from "../../../ui/components/ListItem";
import { secondsToHumanReadable } from "../utils/time";
import ReplyButton from "./ReplyButton";
import ImageDisplay from "./ImageDisplay";
import Avatar from "./Avatar";
import { QuoteButton } from "./QuoteButton";

const useStyles = makeStyles(() => ({
  root: {
    overflowX: "hidden",
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "flex-start",
    width: "100%",
    marginTop: "3px",
  },
  content: {
    display: "flex",
    marginTop: "-10px", // easier to do this here than override the MUI styles
    flexFlow: "column nowrap",
    width: "100%",
  },
  primary: {
    display: "flex",
    flexFlow: "row nowrap",
    width: "100%",
    alignItems: "flex-end",
  },
  profile: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  date: {
    marginLeft: "10px",
    fontSize: "14px",
  },
  message: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  buttonContainer: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    width: "100%",
    marginLeft: "-20px", // easier to do this here than override the MUI styles
    marginTop: "3px",
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

  // this is a workaround to transfer string new lines and returns that
  // are stored into the database into html for the UI to render
  const formattedMessage = message.replace(/\n\r?/g, "<br />");

  return (
    <ListItem className={classes.root} divider>
      <ListItemAvatar>
        <MuiAvatar>
          <Avatar avatarUrl={avatar_url} height="45px" width="45px" />
        </MuiAvatar>
      </ListItemAvatar>
      <div className={classes.content}>
        <div className={classes.primary}>
          <div className={classes.profile}>{`@${profile_name}`}</div>
          <Typography
            className={classes.date}
            component="div"
            variant="body2"
            color="textSecondary"
          >
            {secondsToHumanReadable(t, seconds_since_tweet)}
          </Typography>
        </div>
        <div
          className={classes.message}
          dangerouslySetInnerHTML={{ __html: formattedMessage }}
        />
        <ImageDisplay visible images={images} small />
        <div className={classes.buttonContainer}>
          <ReplyButton profile_name={profile_name} />
          <Button>
            <FavoriteBorderIcon />
          </Button>
          <QuoteButton message={message} />
          <Button>
            <MoreIcon />
          </Button>
        </div>
      </div>
    </ListItem>
  );
};

export default Tweet;
