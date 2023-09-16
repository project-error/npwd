import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { Button } from '@mui/material';
import { setClipboard } from '@os/phone/hooks/useClipboard';

import useStyles from './modal.styles';
import { useNavigate } from 'react-router-dom';
import { GalleryPhoto } from '@typings/photo';
import { useTranslation } from 'react-i18next';

interface IShareModalProps {
  meta: GalleryPhoto;
  referal: string;
  onClose(): void;
}

export const ShareModal = ({ meta, onClose, referal }: IShareModalProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [t] = useTranslation();

  const handleCopyImage = () => {
    setClipboard(meta.image);
    navigate(referal);
  };

  return (
    <Modal visible={!!meta} handleClose={onClose}>
      <div className={classes.shareModal}>
        <div className={classes.innerShareModal}>
          <h4>{t('CAMERA.COPY_IMAGE')}</h4>
          <Button onClick={handleCopyImage} variant="outlined" className={classes.button}>
            Copy image
          </Button>
        </div>
      </div>
    </Modal>
  );
};
