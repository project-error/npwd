import React from 'react'
import Modal from '../../../../ui/components/Modal'
import { useShareLink } from '../../hooks/useShareLink';
import { useShareModal } from '../../hooks/useShareModal'
import { Button } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../../twitter/hooks/useModal';
import CloseIcon from '@material-ui/icons/Close';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAd } from "@fortawesome/free-solid-svg-icons";

export const ShareModal = () => {
  const { shareModal, setShareModal } = useShareModal();
  const { shareLink, setShareLink } = useShareLink();
  const { setModalVisible } = useModal();

 
  let history = useHistory();
 
  const _handleClose = () => {
    setShareModal(false)
    setShareLink(null)
  }

  return (
    <Modal visible={shareModal} handleClose={_handleClose}>
      <div style={{ marginBottom: 50 }}>
        <Button style={{ position: 'absolute', right: 0, width: '10%' }} onClick={_handleClose}><CloseIcon /></Button>
        <div style={{ marginTop: 40 }}>
          <h4 style={{ textAlign: 'center', marginTop: 20 }}>Where do you want to share the photo?</h4>
          <Button>
            {<TwitterIcon />} Twitter
          </Button>
          <Button>
          {<FontAwesomeIcon icon={faAd} fixedWidth size="2x"/>} Advert
          </Button>
        </div>
      </div>
    </Modal>
  )
}
