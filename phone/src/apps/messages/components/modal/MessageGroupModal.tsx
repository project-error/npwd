import React from 'react';
import { Slide, Paper } from '@mui/material';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { styled } from '@mui/styles';

const StyledFormModal = styled(Paper)({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
});

const MessageGroupModal = () => {
  const params = useParams<{ phoneNumber?: string }>();

  return (
    <Slide direction="left" in>
      <StyledFormModal>
        <React.Suspense fallback={<LoadingSpinner />}>
          <NewMessageGroupForm phoneNumber={params.phoneNumber} />
        </React.Suspense>
      </StyledFormModal>
    </Slide>
  );
};

export default MessageGroupModal;
