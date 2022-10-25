import React from 'react';
import { Box } from '@mui/material';
import { CallControls } from './CallControls';
import { styled } from '@mui/styles';

// Absolute usage here should definitely be revisted and
// avoided when possible. Especially with these weird CSS semantics.
const StyledControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: '0',
}));

export const CallNotification: React.FC = ({ children }) => (
  <Box paddingBottom="48px">
    <Box>{children}</Box>
    <StyledControls>
      <CallControls isSmall />
    </StyledControls>
  </Box>
);
