import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Picker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper } from "@material-ui/core";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import CloseIcon from "@material-ui/icons/Close";
import EmojiIcon from "@material-ui/icons/SentimentSatisfied";

import types from "../types";
import "./emoji.css";
import EmojiSelect from "./EmojiSelect";
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
  emojiPicker: {
    background: "none",
    border: "none",
    boxShadow: "none",
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

const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

export const AddTweetModal = ({ visible, handleClose }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  const [text, setText] = useState("");
  const [media, setMedia] = useState(TEMP_MEDIA);
  const [mediaType, setMediaType] = useState(null);
  const [mediaLink, setMediaLink] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();

  const reset = useCallback(() => {
    setMediaType(null);
    setMediaLink(null);
    setShowMedia(false);
    setShowEmoji(false);
    setMedia([]);
    setText("");
  }, []);

  // when the user presses escape we should close the modal
  const _handleEscape = (e) => {
    const isEscapeKey = e.key == "Escape" || e.key == "Esc";
    if (isEscapeKey) {
      e.preventDefault();
      reset();
      handleClose();
    }
  };
  useEffect(() => {
    const listener = window.addEventListener("keydown", _handleEscape, true);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const _handleClose = useCallback(() => {
    reset();
    handleClose();
  });

  const showHideClassName = visible
    ? classes.displayBlock
    : classes.displayNone;

  const submitTweet = () => {
    const data = { text, media };

    console.log("submitting tweet");
    console.log(data);
  };

  const handleTextChange = useCallback((e) => setText(e.target.value), []);

  const addMedia = useCallback(() => {
    setMediaType(null);
    setMediaLink(null);
    // only add the media if it's a valid URL
    // TODO - can we test that it's a valid image in JS?
    if (mediaLink.match(URL_REGEX)) {
      // we add an ID here so that we can have a distinct identifier on the
      // client before it is added to the database. This ID is NOT what used
      // or contained in the database.
      setMedia(media.concat([{ id: uuidv4(), mediaType, mediaLink }]));
    }
  }, [mediaType, mediaLink]);
  const _removeMedia = (id) => setMedia(media.filter((m) => m.id !== id));
  const removeMedia = useCallback(_removeMedia, [media]);
  const _handleMediaChange = (e) => setMediaLink(e.target.value);
  const handleMediaChange = useCallback(_handleMediaChange, []);
  const setMediaTypeImage = useCallback(() => {
    setShowEmoji(false); // clear the emoji so we can switch between emoji/media
    setMediaType(types.IMAGE);
  });
  const closeMediaPrompt = useCallback(() => {
    setMediaType(null);
    setMediaLink(null);
  }, []);

  const toggleShowEmoji = useCallback(() => {
    // clear the media items so we can seemlessly toggle between emoji/media
    setMediaType(null);
    setMediaLink(null);
    setShowEmoji(!showEmoji);
  });
  const _handleEmojiClick = (emojiObject, e) => {
    setText(text.concat(emojiObject.native));
  };
  const handleEmojiClick = useCallback(_handleEmojiClick, [text]);

  const mediaPromptVisible = mediaType && !showEmoji;
  const primaryButtonText = mediaPromptVisible
    ? t("APPS_TWITTER_SUBMIT_MEDIA")
    : t("APPS_TWITTER_TWEET");
  const showCloseButton = mediaType || showEmoji;

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <Button className={classes.close} onClick={_handleClose}>
          <CloseIcon color="action" />
        </Button>
        <TweetText text={text} handleChange={handleTextChange} />
        <MediaPrompt
          visible={mediaPromptVisible}
          value={mediaLink}
          handleChange={handleMediaChange}
        />
        <EmojiSelect visible={showEmoji} onEmojiClick={handleEmojiClick} />
        <MediaDisplay
          visible={!showEmoji}
          media={media}
          removeMedia={removeMedia}
        />
        <div className={classes.buttonsContainer}>
          <div className={classes.leftButtons}>
            <Button
              className={classes.button}
              onClick={mediaType ? closeMediaPrompt : setMediaTypeImage}
            >
              <InsertPhotoIcon color="action" />
            </Button>
            <Button className={classes.button} onClick={toggleShowEmoji}>
              <EmojiIcon color="action" />
            </Button>
          </div>
          <div className={classes.rightButtons}>
            <Button
              variant="contained"
              color="primary"
              onClick={mediaType ? addMedia : submitTweet}
            >
              {primaryButtonText}
            </Button>
            {showCloseButton && (
              <Button
                className={classes.closeMedia}
                variant="contained"
                color="secondary"
                onClick={showEmoji ? toggleShowEmoji : closeMediaPrompt}
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
