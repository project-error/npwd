import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { useShareLink } from '../../hooks/useShareLink';
import { useShareModal } from '../../hooks/useShareModal';
import { Button } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';
import { setClipboard } from '../../../../os/phone/hooks/useClipboard';
import CloseIcon from '@material-ui/icons/Close';

import useStyles from './modal.styles';

export const ShareModal = (meta) => {
  const classes = useStyles();
  const { shareModal, setShareModal } = useShareModal();
  const { setShareLink } = useShareLink();

  const _handleClose = () => {
    setShareModal(false);
    setShareLink(null);
  };

  const handleCopyImage = () => {
    setClipboard(meta.image);
  };

  return (
    <Modal visible={shareModal} handleClose={_handleClose}>
      <div className={classes.shareModal}>
        <Button
          style={{ position: 'absolute', right: 0, width: '10%' }}
          onClick={_handleClose}
        >
          <CloseIcon />
        </Button>
        <div className={classes.innerShareModal}>
          <h4 style={{ textAlign: 'center', marginTop: 20 }}>
            Where do you want to share the photo?
          </h4>
          <Button>{<MessageIcon />} Message</Button>
          <h4>Or just copy the image here:</h4>
          <Button onClick={handleCopyImage} variant='contained'>
            Copy image
          </Button>
        </div>
      </div>
    </Modal>
  );
};
