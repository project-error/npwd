import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { Button } from '@ui/components/Button';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { useNavigate } from 'react-router';
import { GalleryPhoto } from '@typings/photo';
import { useTranslation } from 'react-i18next';

interface IShareModalProps {
  meta: GalleryPhoto;
  referal: string;
  onClose(): void;
}

export const ShareModal = ({ meta, onClose, referal }: IShareModalProps) => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const handleCopyImage = () => {
    setClipboard(meta.image);
    navigate(referal);
  };

  return (
    <Modal visible={!!meta} handleClose={onClose}>
      <div className="mb-12">
        <div className="mt-10 text-center">
          <h4>{t('CAMERA.COPY_IMAGE')}</h4>
          <Button
            onClick={handleCopyImage}
            variant="outlined"
            className="text-keyos-fg hover:bg-white/10"
          >
            Copy image
          </Button>
        </div>
      </div>
    </Modal>
  );
};
