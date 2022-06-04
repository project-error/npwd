import React, { memo, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../../../ui/components/Modal';
import { IMAGE_DELIMITER } from '../utils/images';
import { isImageValid } from '@common/utils/isImageValid';
import { useModal } from '../hooks/useModal';
import EmojiSelect from './EmojiSelect';
import ImageDisplay from './images/ImageDisplay';
import ImagePrompt from './images/ImagePrompt';
import TweetMessage from './tweet/TweetMessage';
import ControlButtons from './buttons/ControlButtons';
import IconButtons from './buttons/IconButtons';
import { usePhone } from '@os/phone/hooks/usePhone';
import { getNewLineCount } from '../utils/message';
import { NewTweet, TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { promiseTimeout } from '../../../utils/promiseTimeout';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { toggleKeys } from '../../../ui/components/Input';
import { Box, styled } from '@mui/material';
import { useWordFilter } from '../../../os/wordfilter/hooks/useWordFilter';

const ButtonsContainer = styled(Box)({
  paddingBottom: '8px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  flex: '1 0 45px',
});

interface Image {
  id: string;
  link: string;
}

const AddTweetModal = () => {
  const { message, setMessage, modalVisible, setModalVisible } = useModal();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const { clean } = useWordFilter();

  const [showEmoji, setShowEmoji] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [link, setLink] = useState('');

  const [images, setImages] = useState<Image[]>([]);

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

  const handleImageChange = useCallback((link) => setLink(link), []);

  const handleMessageChange = useCallback((message) => setMessage(message), [setMessage]);

  if (!ResourceConfig) return null;
  const { characterLimit, newLineLimit } = ResourceConfig.twitter;

  const isValidMessage = (message) => {
    if (message.length > characterLimit) return false;
    if (getNewLineCount(message) < newLineLimit) return true;
  };

  const submitTweet = async () => {
    await promiseTimeout(200);
    const cleanedMessage = clean(message.trim());
    if (cleanedMessage.length === 0) return;
    if (!isValidMessage(cleanedMessage)) return;

    const data: NewTweet = {
      message: cleanedMessage,
      retweet: null,
      images:
        images && images.length > 0 ? images.map((image) => image.link).join(IMAGE_DELIMITER) : '',
    };

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.CREATE_TWEET, data).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('TWITTER.FEEDBACK.CREATE_PROFILE_FAILURE'),
        });
      }
    });

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
  const toggleShowEmoji = async () => {
    // clear the images so we can seemlessly toggle between emoji/images
    setShowImagePrompt(false);
    setShowEmoji(!showEmoji);

    await toggleKeys(showEmoji);
  };

  // this is when a user clicks on an emoji icon itself (i.e. a smiley face)
  // not the emoji icon on the UI
  const handleSelectEmoji = (emojiObject, e) => {
    setMessage(message.concat(emojiObject.native));
  };

  if (!ResourceConfig) return null;

  return (
    <Modal visible={modalVisible} handleClose={_handleClose}>
      <TweetMessage
        modalVisible={modalVisible}
        onEnter={submitTweet}
        message={message}
        handleChange={handleMessageChange}
      />
      <ImagePrompt visible={showImagePrompt} value={link} handleChange={handleImageChange} />
      {/*<EmojiSelect visible={showEmoji} onEmojiClick={handleSelectEmoji} />*/}
      <ImageDisplay
        visible={!showEmoji && images.length > 0}
        images={images}
        removeImage={removeImage}
      />
      <ButtonsContainer>
        <IconButtons
          onImageClick={
            images.length < ResourceConfig.twitter.maxImages ? toggleShowImagePrompt : null
          }
          onEmojiClick={toggleShowEmoji}
        />
        <ControlButtons
          showImagePrompt={showImagePrompt}
          showEmoji={showEmoji}
          onPrimaryClick={showImagePrompt ? addImage : submitTweet}
          onCloseClick={showEmoji ? toggleShowEmoji : toggleShowImagePrompt}
        />
      </ButtonsContainer>
    </Modal>
  );
};

export default memo(AddTweetModal);
