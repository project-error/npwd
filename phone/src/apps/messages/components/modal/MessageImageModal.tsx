import { TextField, Button } from '@material-ui/core';
import React, { useState } from 'react';
import Nui from '../../../../os/nui-events/utils/Nui';
import Modal from '../../../../ui/components/Modal';
import { useImageModal } from '../../hooks/useImageModal';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './modal.styles';

interface IProps {
  messageGroupId: string | undefined;
}

export const MessageImageModal = ({ messageGroupId }: IProps) => {
  const classes = useStyles();
  const { imageModal, setImageModal } = useImageModal();
  const [message, setMessage] = useState('');

  const _handleClose = () => {
    setImageModal(false);
  };

  const sendImageMessage = (event) => {
    if (event.key === 'Enter') {
      Nui.send('phone:sendMessage', {
        groupId: messageGroupId,
        message,
      });
      setImageModal(false);
    }
  };

  return (
    <Modal visible={imageModal} handleClose={_handleClose}>
      <div>
        <Button
          onClick={_handleClose}
          className={classes.imageModalCloseButton}
        >
          <CloseIcon />
        </Button>
        <TextField
          placeholder='A link to your image or gif'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className={classes.input}
          inputProps={{
            className: classes.messagesInput,
          }}
          inputRef={(input) => input && input.focus()}
          onKeyPress={sendImageMessage}
        />
      </div>
    </Modal>
  );
};
