import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { Button } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';
import { setClipboard } from '../../../../os/phone/hooks/useClipboard';
import CloseIcon from '@material-ui/icons/Close';

import useStyles from './modal.styles';
import { ICameraPhoto } from '../../hooks/usePhotos';

interface IShareModalProps {
  meta: ICameraPhoto;
  onClose(): void;
}

export const ShareModal = ({ meta, onClose }: IShareModalProps) => {
  const classes = useStyles();

  const handleCopyImage = () => {
    setClipboard(meta.image);
  };

  return (
    <Modal visible={!!meta} handleClose={onClose}>
      <div className={classes.shareModal}>
        <Button
          style={{ position: 'absolute', right: 0, width: '10%' }}
          onClick={onClose}
        >
          <CloseIcon />
        </Button>
        <div className={classes.innerShareModal}>
          <>
            <h4 style={{ textAlign: 'center', marginTop: 20 }}>
              Where do you want to share the photo?
            </h4>
            <Button>{<MessageIcon />} Message</Button>
            <h4>Or just copy the image here:</h4>
            <Button onClick={handleCopyImage} variant='contained'>
              Copy image
            </Button>
          </>
        </div>
      </div>
    </Modal>
  );
};
