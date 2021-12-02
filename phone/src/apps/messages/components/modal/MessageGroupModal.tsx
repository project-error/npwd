import React from 'react';
import { Slide, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useStyles from './modal.styles';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { useHistory, useParams } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const MessageGroupModal = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleClose = () => history.push('/messages');

  const params = useParams<{ phoneNumber?: string }>();

  return (
    <Slide direction="left" in>
      <Paper className={classes.modalRoot}>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Button onClick={handleClose}>
            <ArrowBackIcon fontSize="large" />
          </Button>
          <NewMessageGroupForm phoneNumber={params.phoneNumber} />
        </React.Suspense>
      </Paper>
    </Slide>
  );
};

export default MessageGroupModal;
