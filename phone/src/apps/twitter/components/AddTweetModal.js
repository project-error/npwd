import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { v4 as uuidv4 } from "uuid";

import Nui from "../../../os/nui-events/utils/Nui";
import types from "../types";
import { withValidMedia } from "../utils/media";
import "./emoji.css";
import EmojiSelect from "./EmojiSelect";
import MediaDisplay from "./MediaDisplay";
import MediaPrompt from "./MediaPrompt";
import TweetText from "./TweetText";
import ControlButtons from "./ControlButtons";
import IconButtons from "./IconButtons";
import AddTweetStatus from "./AddTweetStatus";

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

export const AddTweetModal = ({ visible, handleClose }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [mediaLink, setMediaLink] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();

  const reset = useCallback(() => {
    setMediaType(null);
    setMediaLink(null);
    setShowEmoji(false);
    setMedia([]);
    setText("");
  }, []);

  const _handleClose = useCallback(() => {
    reset();
    handleClose();
  });

  // when the user presses escape we should close the modal
  const _handleEscape = (e) => {
    const isEscapeKey = e.key == "Escape" || e.key == "Esc";
    if (isEscapeKey) {
      e.preventDefault();
      reset();
      _handleClose();
    }
  };
  useEffect(() => {
    const listener = window.addEventListener("keydown", _handleEscape, true);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const showHideClassName = visible
    ? classes.displayBlock
    : classes.displayNone;

  const submitTweet = () => {
    const data = { message: text, media, realUser: "testUser" };
    Nui.send("phone:createTweet", data);
  };

  const handleTextChange = (e) => setText(e.target.value);

  const addMedia = () => {
    setMediaType(null);
    setMediaLink(null);

    withValidMedia(mediaLink, () =>
      setMedia(media.concat([{ id: uuidv4(), mediaType, mediaLink }]))
    );
  };
  const removeMedia = (id) => setMedia(media.filter((m) => m.id !== id));
  const handleMediaChange = (e) => setMediaLink(e.target.value);
  const setMediaTypeImage = () => {
    setShowEmoji(false); // clear the emoji so we can switch between emoji/media
    setMediaType(types.IMAGE);
  };
  const closeMediaPrompt = () => {
    setMediaType(null);
    setMediaLink(null);
  };

  const toggleShowEmoji = () => {
    // clear the media items so we can seemlessly toggle between emoji/media
    setMediaType(null);
    setMediaLink(null);
    setShowEmoji(!showEmoji);
  };
  const handleEmojiClick = (emojiObject, e) => {
    setText(text.concat(emojiObject.native));
  };
  const mediaPromptVisible = mediaType && !showEmoji;

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <Button className={classes.close} onClick={_handleClose}>
          <CloseIcon color="action" />
        </Button>
        <TweetText text={text} handleChange={handleTextChange} />
        <AddTweetStatus />
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
          <IconButtons
            onMediaClick={mediaType ? closeMediaPrompt : setMediaTypeImage}
            onEmojiClick={toggleShowEmoji}
          />
          <ControlButtons
            mediaType={mediaType}
            showEmoji={showEmoji}
            onPrimaryClick={mediaType ? addMedia : submitTweet}
            onCloseClick={showEmoji ? toggleShowEmoji : closeMediaPrompt}
          />
        </div>
      </Paper>
    </div>
  );
};

export default AddTweetModal;
