import React, { useCallback, useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import Modal from '../../../../ui/components/Modal';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Box, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { ContextMenu } from '../../../../ui/components/ContextMenu';
import { deleteQueryFromLocation } from '../../../../common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';
import { MessageEvents } from '../../../../../../typings/messages';
import { fetchNui } from '../../../../utils/fetchNui';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

interface IProps {
  isOpen: boolean;
  messageGroupId: string | undefined;

  onClose(): void;

  image?: string;
}

export const MessageImageModal = ({ isOpen, messageGroupId, onClose, image }: IProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const { addAlert } = useSnackbar();
  const [queryParamImagePreview, setQueryParamImagePreview] = useState(null);

  const removeQueryParamImage = useCallback(() => {
    setQueryParamImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search]);

  const sendImageMessage = useCallback(
    (m) => {
      fetchNui(MessageEvents.SEND_MESSAGE, { conversationId: messageGroupId, message: m }).then(
        (resp) => {
          if (resp !== 'ok') {
            onClose();
            return addAlert({
              message: t('APPS_MESSAGES_NEW_MESSAGE_FAILED'),
              type: 'error',
            });
          }
          onClose();
        },
      );
    },
    [messageGroupId, onClose, addAlert, t],
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
    setQueryParamImagePreview(image);
  }, [image]);

  const menuOptions = useMemo(
    () => [
      {
        label: 'Camera / Gallery',
        icon: <PhotoLibraryIcon />,
        onClick: () =>
          history.push(
            `/camera?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`,
          ),
      },
    ],
    [history, pathname, search],
  );

  return (
    <>
      <ContextMenu open={isOpen} options={menuOptions} onClose={onClose} />
      <Modal visible={queryParamImagePreview} handleClose={removeQueryParamImage}>
        <Box py={1}>
          <Typography paragraph>Do you want to share this image?</Typography>
          <PictureResponsive src={queryParamImagePreview} alt="Share gallery image preview" />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => sendFromQueryParam(queryParamImagePreview)}
          >
            Share
          </Button>
        </Box>
      </Modal>
    </>
  );
};
