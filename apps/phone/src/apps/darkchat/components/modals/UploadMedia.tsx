import React from 'react';
import { Modal } from '@ui/components/Modal';
import { useModal } from '../../hooks/useModal';
import { Image, Send } from 'lucide-react';
import { TextField } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { useLocation, useNavigate } from 'react-router';
import qs from 'qs';
import { isImageValid } from '../../../../common/utils/isImageValid';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '../../../../os/simcard/hooks/useMyPhoneNumber';
import { useTranslation } from 'react-i18next';

export const UploadMediaModal = () => {
  const { modalVisible, setModalVisible, modalMedia, setModalMedia } = useModal();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();
  const phoneNumber = useMyPhoneNumber();
  const [t] = useTranslation();

  const handleImageGallery = () => {
    navigate(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  };

  const handleSendImage = () => {
    const link = modalMedia;
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
        value={modalMedia}
        onChange={(e) => setModalMedia(e.target.value)}
      />
      <div className="flex flex-[1_0_45px] flex-row flex-nowrap justify-between p-2">
        <Button variant="text" color="secondary" startIcon={<Image size={18} />} onClick={handleImageGallery}>
          {t('DARKCHAT.MEDIA_GALLERY')}
        </Button>
        <Button variant="text" color="secondary" startIcon={<Send size={18} />} onClick={handleSendImage}>
          {t('GENERIC.SEND')}
        </Button>
      </div>
    </Modal>
  );
};
