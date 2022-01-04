import React from 'react';
import { Box, BoxProps, CircularProgress } from '@mui/material';

export const LoadingSpinner: React.FC<BoxProps> = ({ ...props }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height={props.height ?? '100%'}
    {...props}
  >
    <CircularProgress />
  </Box>
);
