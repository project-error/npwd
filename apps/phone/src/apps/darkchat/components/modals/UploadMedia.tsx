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
import { useTranslation } from 'react-i18next';

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
  const [t] = useTranslation();

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
        setModalVisible(false);
        setModalMedia('');
      })
      .catch(console.error);
  };

  return (
    <Modal visible={modalVisible} handleClose={() => setModalVisible(false)}>
      <TextField
        placeholder={t('DARKCHAT.MEDIA_PLACEHOLDER')}
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
          {t('DARKCHAT.MEDIA_GALLERY')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={handleSendImage}
        >
          {t('GENERIC.SEND')}
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};
