import React, { useCallback, useEffect } from 'react';
import Modal from '../../../../ui/components/Modal';
import { Box, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '../../../../../../typings/messages';

interface IProps {
  isOpen: boolean;
  messageGroup: MessageConversation | undefined;

  onClose(): void;
  image?: string;
  setImagePreview: (preview: string | null) => void;
}

export const MessageImageModal = ({ isOpen, messageGroup, onClose, image }: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { sendMessage } = useMessageAPI();
  const removeQueryParamImage = useCallback(() => {
    setImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search, setImagePreview]);

  const sendImageMessage = useCallback(
    (m) => {
      sendMessage({
        conversationId: messageGroup.conversation_id,
        message: m,
        tgtPhoneNumber: messageGroup.phoneNumber,
      });
      onClose();
    },
    [sendMessage, messageGroup, onClose],
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
