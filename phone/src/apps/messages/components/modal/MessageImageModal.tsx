import React, { useCallback, useEffect } from 'react';
import Modal from '../../../../ui/components/Modal';
import { Box, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';

interface IProps {
  messageGroup: MessageConversation | undefined;
  imagePreview: any;
  onClose(): void;
  image?: string;
  setImagePreview: (preview: string | null) => void;
}

export const MessageImageModal = ({
  messageGroup,
  onClose,
  image,
  setImagePreview,
  imagePreview,
}: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { sendMessage } = useMessageAPI();
  const removeQueryParamImage = useCallback(() => {
    setImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search, setImagePreview]);
  const { activeMessageConversation } = useMessages();

  const sendImageMessage = useCallback(
    (m) => {
      sendMessage({
        conversationId: messageGroup.id,
        conversationList: activeMessageConversation.conversationList,
        message: m,
        tgtPhoneNumber: messageGroup.participant,
      });
      onClose();
    },
    [sendMessage, messageGroup, onClose, activeMessageConversation],
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      sendImageMessage(image);
      removeQueryParamImage();
    },
    [removeQueryParamImage, sendImageMessage],
  );

  useEffect(() => {
    if (!image) return;
    setImagePreview(image);
  }, [image, setImagePreview]);

  return (
    <>
      <Modal visible={imagePreview} handleClose={removeQueryParamImage}>
        <Box py={1}>
          <Typography paragraph>{t('MESSAGES.SHARE_IMAGE_TITLE')}</Typography>
          <PictureResponsive src={imagePreview} alt="Share gallery image preview" />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => sendFromQueryParam(imagePreview)}
          >
            {t('GENERIC.SHARE')}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
