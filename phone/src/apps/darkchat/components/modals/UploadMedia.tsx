import React from 'react';
import { Modal } from '@ui/components/Modal';
import { useModal } from '../../hooks/useModal';
import { Box, Button, styled, TextField } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import SendIcon from '@mui/icons-material/Send';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { isImageValid } from '../../../../common/utils/isImageValid';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '../../../../os/simcard/hooks/useMyPhoneNumber';

const ButtonsContainer = styled(Box)({
  padding: '8px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  flex: '1 0 45px',
});

export const UploadMediaModal = () => {
  const { modalVisible, setModalVisible, modalMedia, setModalMedia } = useModal();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();
  const phoneNumber = useMyPhoneNumber();

  const handleImageGallery = () => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  };

  const handleSendImage = () => {
    const link = modalMedia;
    // Strip whitespace
    link.replace('/ /g', '');

    isImageValid(link)
      .then(() => {
        sendMessage({
          type: 'image',
          message: modalMedia,
          channelId,
          phoneNumber,
        });
      })
      .catch(console.error);
  };

  return (
    <Modal visible={modalVisible} handleClose={() => setModalVisible(false)}>
      <TextField
        placeholder="Media URL"
        variant="standard"
        value={modalMedia}
        onChange={(e) => setModalMedia(e.target.value)}
      />
      <ButtonsContainer>
        <Button
          variant="text"
          color="secondary"
          startIcon={<CollectionsIcon />}
          onClick={handleImageGallery}
        >
          CHOOSE IMAGE
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={handleSendImage}
        >
          SEND
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};
