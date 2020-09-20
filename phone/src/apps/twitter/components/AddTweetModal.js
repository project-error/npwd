import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
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
    paddingLeft: "5px", // re-align left buttons after overriding material-ui spacing
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
    minWidth: "45px", // override default material-ui spacing between buttons
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

const TEMP_MEDIA = [
  {
    id: uuidv4(),
    mediaType: "image",
    mediaLink:
      "http://www.freedigitalphotos.net/images/thumbs/city-10011901.jpg",
  },
  {
    id: uuidv4(),
    mediaType: "image",
    mediaLink:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&w=1000&q=80",
  },
  {
    id: uuidv4(),
    mediaType: "image",
    mediaLink:
      "https://static01.nyt.com/images/2020/07/17/business/00virus-cities1/00virus-cities1-mediumSquareAt3X.jpg",
  },
  {
    id: uuidv4(),
    mediaType: "image",
    mediaLink:
      "https://image.cnbcfm.com/api/v1/image/105066394-GettyImages-498350103_1.jpg?v=1591858410",
  },
  {
    id: uuidv4(),
    mediaType: "image",
    mediaLink:
      "https://www.cbre.us/-/media/cbre/countryunitedkingdom/images/our-cities/231_what_makes_a_successful_city_image2_1024x576.jpg",
  },
];

export const AddTweetModal = ({ visible, handleClose }) => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(TEMP_MEDIA);
  const [mediaType, setMediaType] = useState(null);
  const [mediaLink, setMediaLink] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();
  const showHideClassName = visible
    ? classes.displayBlock
    : classes.displayNone;

  const submitTweet = () => {
    const data = { text, media };

    console.log("submitting tweet");
    console.log(data);
  };

  const addMedia = useCallback(() => {
    // we add an ID here so that we can have a distinct identifier on the
    // client before it is added to the database. This ID is NOT what used
    // or contained in the database.
    setMedia(media.concat([{ id: uuidv4(), mediaType, mediaLink }]));
    setMediaType(null);
    setMediaLink(null);
  }, [mediaType, mediaLink]);

  const _removeMedia = (id) => setMedia(media.filter((m) => m.id !== id));
  const removeMedia = useCallback(_removeMedia, [media]);

  const closeMediaPrompt = useCallback(() => {
    setMediaType(null);
    setMediaLink(null);
  }, []);

  console.log(media);
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
        <MediaDisplay media={media} removeMedia={removeMedia} />
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
                onClick={closeMediaPrompt}
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
