import { Button, IconButton, TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import Nui from '../../../../os/nui-events/utils/Nui';
import Modal from '../../../../ui/components/Modal';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './modal.styles';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import url from 'parse-url';

interface IProps {
  isOpen: boolean;
  messageGroupId: string | undefined;
  onClose(): void;
  image?: string;
}

export const MessageImageModal = ({
  isOpen,
  messageGroupId,
  onClose,
  image,
}: IProps) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [pasteVisible, setPasteVisible] = useState(false);
  const history = useHistory();
  const { pathname, search } = useLocation();

  const sendImageMessage = useCallback(
    (m) => {
      Nui.send('phone:sendMessage', {
        groupId: messageGroupId,
        message: m,
      });
      onClose();
    },
    [messageGroupId, onClose]
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      sendImageMessage(image);
      const { query } = url(pathname + search);
      history.push(
        `${pathname}/?${qs.stringify({ ...query, image: undefined })}`
      );
    },
    [history, pathname, search, sendImageMessage]
  );

  useEffect(() => {
    if (!image) return;
    sendFromQueryParam(image);
  }, [image, sendFromQueryParam]);

  const sendFromClipboard = (event) => {
    if (event.key === 'Enter') {
      sendImageMessage(message);
    }
  };

  return (
    <Modal visible={isOpen} handleClose={onClose}>
      <div>
        {pasteVisible ? (
          <>
            <TextField
              placeholder='A link to your image or gif'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className={classes.input}
              inputProps={{
                className: classes.messagesInput,
              }}
              inputRef={(input) => input && input.focus()}
              onKeyPress={sendFromClipboard}
            />
            <IconButton
              onClick={() => setPasteVisible(false)}
              color='secondary'
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              startIcon={<FileCopyIcon />}
              onClick={() => setPasteVisible(true)}
            >
              Paste from clipboard
            </Button>
            <Button
              startIcon={<PhotoLibraryIcon />}
              onClick={() =>
                history.push(
                  `/camera?${qs.stringify({
                    referal: encodeURIComponent(pathname + search),
                  })}`
                )
              }
            >
              Open camera gallery
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};
