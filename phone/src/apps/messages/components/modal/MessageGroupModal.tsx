import React from 'react';
import { Slide, Paper } from '@mui/material';
import useStyles from './modal.styles';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const MessageGroupModal = () => {
  const classes = useStyles();

  const params = useParams<{ phoneNumber?: string }>();

  return (
    <Slide direction="left" in>
      <Paper className={classes.modalRoot}>
        <React.Suspense fallback={<LoadingSpinner />}>
          <NewMessageGroupForm phoneNumber={params.phoneNumber} />
        </React.Suspense>
      </Paper>
    </Slide>
  );
};

export default MessageGroupModal;
