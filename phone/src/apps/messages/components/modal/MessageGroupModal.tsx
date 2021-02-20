import React from 'react';
import { Slide, Paper, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useStyles from './modal.styles';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { useHistory, useParams } from 'react-router-dom';

const MessageGroupModal = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleClose = () => history.push('/messages');

  const params = useParams<{ phoneNumber?: string }>();

  return (
    <Slide direction='left' in>
      <Paper className={classes.modalRoot}>
        <Button onClick={handleClose}>
          <ArrowBackIcon fontSize='large' />
        </Button>
        <NewMessageGroupForm phoneNumber={params.phoneNumber} />
      </Paper>
    </Slide>
  );
};

export default MessageGroupModal;
