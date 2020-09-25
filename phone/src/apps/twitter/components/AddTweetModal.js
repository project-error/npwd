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

const IMAGES = [
  "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/boston/c07044da_9483_4fd5_8e37_5b75513dcc80_6b058b6f-7bdc-4f11-b217-4561c07901f3.jpg",
  "https://www.hiusa.org/wp-content/uploads/2020/04/Aerial-View-Boston-Osman-Rana-Unsplash-1000x550-compressor-778x446.jpg",
  "https://www.mccarter.com/wp-content/uploads/2019/10/Location-Boston.png",
];

export const AddTweetModal = ({ visible, handleClose }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [image, setimage] = useState("");

  const [text, setText] = useState("");
  const [images, setImages] = useState(IMAGES);
  const classes = useStyles();

  const reset = useCallback(() => {
    setShowImagePrompt(null);
    setShowEmoji(false);

    setimage("");
    setImages([]);
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
    const data = {
      message: text,
      images: images.join(IMAGE_DELIMITER),
      realUser: "testUser",
    };
    Nui.send("phone:createTweet", data);
  };

  const handleTextChange = (e) => setText(e.target.value);

  const addImage = () => {
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
  const handleEmojiClick = (emojiObject, e) => {
    setText(text.concat(emojiObject.native));
  };

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <Button className={classes.close} onClick={_handleClose}>
          <CloseIcon color="action" />
        </Button>
        <TweetText text={text} handleChange={handleTextChange} />
        <AddTweetStatus />
        <ImagePrompt
          visible={showImagePrompt}
          value={image}
          handleChange={handleimageChange}
        />
        <EmojiSelect visible={showEmoji} onEmojiClick={handleEmojiClick} />
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
