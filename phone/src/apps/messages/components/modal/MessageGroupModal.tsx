import React from 'react';
import { Slide, Paper } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useStyles from './modal.styles';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { useHistory, useParams } from 'react-router-dom';
import { MessagesButton } from '../styled/MessagesButton';

const MessageGroupModal = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleClose = () => history.push('/messages');

  const params = useParams<{ phoneNumber?: string }>();

  return (
    <Slide direction='left' in>
      <Paper className={classes.modalRoot}>
        <MessagesButton onClick={handleClose}>
          <ArrowBackIcon fontSize='large' />
        </MessagesButton>
        <NewMessageGroupForm phoneNumber={params.phoneNumber} />
      </Paper>
    </Slide>
  );
};

export default MessageGroupModal;
