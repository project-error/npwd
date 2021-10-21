import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { Button } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { setClipboard } from '../../../../os/phone/hooks/useClipboard';

import useStyles from './modal.styles';
import { useHistory } from 'react-router-dom';
import { GalleryPhoto } from '../../../../../../typings/photo';
import { useTranslation } from 'react-i18next';

interface IShareModalProps {
  meta: GalleryPhoto;
  referal: string;
  onClose(): void;
}

export const ShareModal = ({ meta, onClose, referal }: IShareModalProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const handleCopyImage = () => {
    setClipboard(meta.image);
    history.push(referal);
  };

  return (
    <Modal visible={!!meta} handleClose={onClose}>
      <div className={classes.shareModal}>
        <div className={classes.innerShareModal}>
          <>
            <h4 style={{ textAlign: 'center', marginTop: 20 }}>
              Where do you want to share the photo?
              {t('CAMERA.SHARE_DESTINATION')}
            </h4>
            <h4>{t('CAMERA.COPY_IMAGE')}</h4>
            <Button onClick={handleCopyImage} variant="contained">
              Copy image
            </Button>
          </>
        </div>
      </div>
    </Modal>
  );
};
