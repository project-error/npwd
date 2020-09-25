import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { v4 as uuidv4 } from "uuid";

import Nui from "../../../os/nui-events/utils/Nui";
import { IMAGE_DELIMITER } from "../utils/images";
import { withValidImage } from "../utils/images";
import "./emoji.css";
import EmojiSelect from "./EmojiSelect";
import ImageDisplay from "./ImageDisplay";
import ImagePrompt from "./ImagePrompt";
import TweetMessage from "./TweetMessage";
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
  const classes = useStyles();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [image, setimage] = useState("");

  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

  const reset = () => {
    setShowImagePrompt(null);
    setShowEmoji(false);

    setimage("");
    setImages([]);
    setMessage("");
  };

  const _handleClose = () => {
    reset();
    handleClose();
  };

  // when the user presses escape we should close the modal
  const _handleEscape = (e) => {
    const isEscapeKey = e.key == "Escape" || e.key == "Esc";
    if (isEscapeKey) {
      e.preventDefault();
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
    const data = {
      message,
      images: images && images.length > 0 ? images.join(IMAGE_DELIMITER) : "",
      realUser: "testUser",
    };
    Nui.send("phone:createTweet", data);
    _handleClose();
  };

  const handleMessageChange = (e) => setMessage(e.target.value);

  const addImage = () => {
    // it's worth noting that we only perform this validation on
    // the client of the user who is submitting the image. When
    // other users see this image on their TweetList it will be
    // from the database and should already have passed through
    // this logic
    withValidImage(image, () => setImages([...images, image]));

    setShowImagePrompt(false);
    setimage("");
  };
  const removeImage = (image) => setImages(images.filter((i) => i !== image));
  const handleimageChange = (e) => setimage(e.target.value);
  const toggleShowImagePrompt = () => {
    setShowEmoji(false); // clear the emoji so we can switch between emoji/images
    setShowImagePrompt(!showImagePrompt);
  };
  const toggleShowEmoji = () => {
    // clear the images so we can seemlessly toggle between emoji/images
    setShowImagePrompt(false);
    setImages("");
    setShowEmoji(!showEmoji);
  };

  // this is when a user clicks on an emoji icon itself (i.e. a smiley face)
  // not the emoji icon on the UI
  const handleSelectEmoji = (emojiObject, e) => {
    setMessage(message.concat(emojiObject.native));
  };

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <Button className={classes.close} onClick={_handleClose}>
          <CloseIcon color="action" />
        </Button>
        <TweetMessage message={message} handleChange={handleMessageChange} />
        <AddTweetStatus />
        <ImagePrompt
          visible={showImagePrompt}
          value={image}
          handleChange={handleimageChange}
        />
        <EmojiSelect visible={showEmoji} onEmojiClick={handleSelectEmoji} />
        <ImageDisplay
          visible={!showEmoji && images.length > 0}
          images={images}
          removeImage={removeImage}
        />
        <div className={classes.buttonsContainer}>
          <IconButtons
            onImageClick={toggleShowImagePrompt}
            onEmojiClick={toggleShowEmoji}
          />
          <ControlButtons
            showImagePrompt={showImagePrompt}
            showEmoji={showEmoji}
            onPrimaryClick={showImagePrompt ? addImage : submitTweet}
            onCloseClick={showEmoji ? toggleShowEmoji : toggleShowImagePrompt}
          />
        </div>
      </Paper>
    </div>
  );
};

export default AddTweetModal;
