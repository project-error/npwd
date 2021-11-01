import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const LoadingSpinner: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    <CircularProgress />
  </Box>
);
