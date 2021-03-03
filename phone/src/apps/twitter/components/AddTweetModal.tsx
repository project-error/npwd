import React, { useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';

import Nui from '../../../os/nui-events/utils/Nui';
import Modal from '../../../ui/components/Modal';
import { IMAGE_DELIMITER, isImageValid } from '../utils/images';
import { useModal } from '../hooks/useModal';
import EmojiSelect from './EmojiSelect';
import ImageDisplay from './images/ImageDisplay';
import ImagePrompt from './images/ImagePrompt';
import TweetMessage from './tweet/TweetMessage';
import ControlButtons from './buttons/ControlButtons';
import IconButtons from './buttons/IconButtons';
import { usePhone } from '../../../os/phone/hooks/usePhone';
import { getNewLineCount } from '../utils/message';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 10,
    marginTop: '15px',
    width: '90%',
    display: 'flex',
    flexFlow: 'column nowrap',
    position: 'absolute',
    top: '80px',
  },
  button: {
    margin: 5,
    marginTop: 20,
  },
  buttonsContainer: {
    paddingBottom: '8px',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    flex: '1 0 45px',
  },
  emojiPicker: {
    background: 'none',
    border: 'none',
    boxShadow: 'none',
  },
}));

interface Image {
  id: string;
  link: string;
}

export const AddTweetModal = () => {
  const classes = useStyles();
  const { message, setMessage, modalVisible, setModalVisible } = useModal();
  const { config } = usePhone();

  const [showEmoji, setShowEmoji] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [link, setLink] = useState('');

  const [images, setImages] = useState<Image[]>([]);
  const { characterLimit, newLineLimit } = config.twitter;

  const reset = () => {
    setShowImagePrompt(false);
    setShowEmoji(false);

    setLink('');
    setImages([]);
    setMessage('');
  };

  const _handleClose = () => {
    reset();
    setModalVisible(false);
  };

  // when the user presses escape we should close the modal
  const _handleEscape = (e) => {
    const isEscapeKey = e.key === 'Escape' || e.key === 'Esc';
    if (isEscapeKey) {
      e.preventDefault();
      _handleClose();
    }
  };

  const handleimageChange = useCallback((link) => setLink(link), []);

  const handleMessageChange = useCallback((message) => setMessage(message), [setMessage]);

  useEffect(() => {
    window.addEventListener('keydown', _handleEscape, true);
    return () => window.removeEventListener('keydown', _handleEscape);
  });
  if (!config) return null;

  const isValidMessage = (message) => {
    if (message.length > characterLimit) return false;
    if (getNewLineCount(message) < newLineLimit) return true;
  };

  const submitTweet = () => {
    const cleanedMessage = message.trim();
    if (cleanedMessage.length === 0) return;
    if (!isValidMessage(cleanedMessage)) return;

    const data = {
      message,
      images:
        images && images.length > 0 ? images.map((image) => image.link).join(IMAGE_DELIMITER) : '',
      realUser: 'testUser',
    };
    Nui.send('phone:createTweet', data);
    _handleClose();
  };

  const addImage = () => {
    // strip any whitespace from the link in case the user
    // added some spaces/returns accidentally
    const cleanedLink = link.replace('/ /g', '');
    // because we're only storing strings in the database we need
    // to give this an arbirtrary (but unique) id so that we can
    // correctly filter an array of images when the user wants to
    // delete them. This handles an edge case where the user adds
    // two of the same image.
    const image = { id: uuidv4(), link: cleanedLink };
    // it's worth noting that we only perform this validation on
    // the client of the user who is submitting the image. When
    // other users see this image on their TweetList it will be
    // from the database and should already have passed through
    // this logic
    isImageValid(cleanedLink)
      .then(() => setImages([...images, image]))
      .catch((e) => console.error(e));

    setShowImagePrompt(false);
    setLink('');
  };
  const removeImage = (id) => setImages(images.filter((image) => id !== image.id));

  const toggleShowImagePrompt = () => {
    setShowEmoji(false); // clear the emoji so we can switch between emoji/images
    setShowImagePrompt(!showImagePrompt);
  };
  const toggleShowEmoji = () => {
    // clear the images so we can seemlessly toggle between emoji/images
    setShowImagePrompt(false);
    setShowEmoji(!showEmoji);
  };

  // this is when a user clicks on an emoji icon itself (i.e. a smiley face)
  // not the emoji icon on the UI
  const handleSelectEmoji = (emojiObject, e) => {
    setMessage(message.concat(emojiObject.native));
  };

  if (!config) return null;

  return (
    <Modal visible={modalVisible} handleClose={_handleClose}>
      <TweetMessage
        modalVisible={modalVisible}
        message={message}
        handleChange={handleMessageChange}
      />
      <ImagePrompt visible={showImagePrompt} value={link} handleChange={handleimageChange} />
      <EmojiSelect visible={showEmoji} onEmojiClick={handleSelectEmoji} />
      <ImageDisplay
        visible={!showEmoji && images.length > 0}
        images={images}
        removeImage={removeImage}
      />
      <div className={classes.buttonsContainer}>
        <IconButtons
          onImageClick={images.length < config.twitter.maxImages ? toggleShowImagePrompt : null}
          onEmojiClick={toggleShowEmoji}
        />
        <ControlButtons
          showImagePrompt={showImagePrompt}
          showEmoji={showEmoji}
          onPrimaryClick={showImagePrompt ? addImage : submitTweet}
          onCloseClick={showEmoji ? toggleShowEmoji : toggleShowImagePrompt}
        />
      </div>
    </Modal>
  );
};

export default AddTweetModal;
