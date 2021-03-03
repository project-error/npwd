import { Box, Button, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import qs from 'qs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '../../../../common/utils/deleteQueryFromLocation';
import { isImage } from '../../../../common/utils/isImage';
import Nui from '../../../../os/nui-events/utils/Nui';
import { ContextMenu } from '../../../../ui/components/ContextMenu';
import Modal from '../../../../ui/components/Modal';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';

interface IProps {
  isOpen: boolean;
  messageGroupId: string | undefined;
  onClose(): void;
  image?: string;
}

export const MessageImageModal = ({ isOpen, messageGroupId, onClose, image }: IProps) => {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const { addAlert } = useSnackbar();

  const removeImage = useCallback(() => {
    setImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search]);

  const sendImageMessage = useCallback(
    (m) => {
      Nui.send('phone:sendMessage', {
        groupId: messageGroupId,
        message: m,
      });
      onClose();
    },
    [messageGroupId, onClose],
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      sendImageMessage(image);
      removeImage();
    },
    [removeImage, sendImageMessage],
  );

  useEffect(() => {
    if (!image) return;
    setImagePreview(image);
  }, [image, sendFromQueryParam]);

  const sendFromClipboard = (event) => {
    navigator.clipboard.readText().then((text) => {
      if (isImage(text)) {
        setImagePreview(text);
      } else {
        addAlert({ message: 'MESSAGES_NO_LINK_CLIPBOARD', type: 'error' });
      }
    });
  };

  const menuOptions = useMemo(
    () => [
      {
        label: 'Paste from clipboard',
        icon: <FileCopyIcon />,
        onClick: sendFromClipboard,
      },
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
      <Modal visible={imagePreview} handleClose={removeImage}>
        <Box py={1}>
          <Typography paragraph>Do you want to share this image?</Typography>
          <PictureResponsive src={imagePreview} alt={'Share gallery image preview'} />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => sendFromQueryParam(imagePreview)}
          >
            Share
          </Button>
        </Box>
      </Modal>
    </>
  );
};
