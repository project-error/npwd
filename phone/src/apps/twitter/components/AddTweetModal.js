import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper } from "@material-ui/core";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import GifIcon from "@material-ui/icons/Gif";
import CloseIcon from "@material-ui/icons/Close";
import EmojiIcon from "@material-ui/icons/SentimentSatisfied";

import types from "../types";
import MediaDisplay from "./MediaDisplay";
import MediaPrompt from "./MediaPrompt";
import TweetText from "./TweetText";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: 5,
    marginTop: 20,
  },
  root: {
    zIndex: 2,
    background: "#232323",
    marginTop: "15px",
    width: "90%",
    display: "flex",
    flexFlow: "column nowrap",
  },
  close: {
    position: "absolute",
    top: "12px",
    right: "4px",
    zIndex: 2,
  },
  buttonsContainer: {
    paddingBottom: "8px",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    flex: "1 0 45px",
  },
  leftButtons: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
  },
  rightButtons: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-end",
    alignItems: "justify-content",
    marginRight: "15px",
  },
  button: {
    background: "transparent",
  },
  buttonHidden: {
    display: "none",
  },
  closeMedia: {
    marginLeft: "8px",
  },
  displayBlock: {
    /*Sets modal to center*/
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  displayNone: {
    display: "none",
  },
}));

export const AddTweetModal = ({ visible, handleClose }) => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaLink, setMediaLink] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();
  const showHideClassName = visible
    ? classes.displayBlock
    : classes.displayNone;

  const submitTweet = () => {
    const data = { text, ...media };

    console.log("submitting tweet");

    console.log(data);
  };

  const addMedia = useCallback(() => {
    setMedia({ mediaType, mediaLink });
    setMediaType(null);
    setMediaLink(null);
  }, [mediaType, mediaLink]);

  const closeMedia = useCallback(() => {
    setMediaType(null);
    setMediaLink(null);
  }, []);

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <Button className={classes.close} onClick={handleClose}>
          <CloseIcon color="action" />
        </Button>
        <TweetText text={text} handleChange={(e) => setText(e.target.value)} />
        {mediaType && (
          <MediaPrompt
            value={mediaLink}
            handleChange={(e) => setMediaLink(e.target.value)}
          />
        )}
        {media && <MediaDisplay {...media} />}
        <div className={classes.buttonsContainer}>
          <div className={classes.leftButtons}>
            <Button
              className={classes.button}
              onClick={() => setMediaType(types.IMAGE)}
            >
              <InsertPhotoIcon color="action" />
            </Button>
            <Button className={classes.button}>
              <EmojiIcon color="action" />
            </Button>
          </div>
          <div className={classes.rightButtons}>
            <Button
              variant="contained"
              color="primary"
              onClick={mediaType ? addMedia : submitTweet}
            >
              {mediaType
                ? t("APPS_TWITTER_SUBMIT_MEDIA")
                : t("APPS_TWITTER_TWEET")}
            </Button>
            {mediaType && (
              <Button
                className={classes.closeMedia}
                variant="contained"
                color="secondary"
                onClick={closeMedia}
              >
                {t("APPS_TWITTER_CLOSE_MEDIA")}
              </Button>
            )}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default AddTweetModal;
