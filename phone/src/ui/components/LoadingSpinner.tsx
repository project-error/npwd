import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

export const LoadingSpinner: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    <CircularProgress />
  </Box>
);
