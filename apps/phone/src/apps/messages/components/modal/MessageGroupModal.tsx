import React from 'react';
import { Slide, Paper } from '@mui/material';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { styled } from '@mui/styles';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';

const StyledFormModal = styled(Paper)({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
});

const MessageGroupModal = () => {
  const { phoneNumber } = useQueryParams<{ phoneNumber?: string }>();

  return (
    <Slide direction="left" in>
      <StyledFormModal>
        <React.Suspense fallback={<LoadingSpinner />}>
          <NewMessageGroupForm phoneNumber={phoneNumber} />
        </React.Suspense>
      </StyledFormModal>
    </Slide>
  );
};

export default MessageGroupModal;
