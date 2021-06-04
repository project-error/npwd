import React from 'react';
import { MarketplaceList } from './MarketplaceList';
import { Box, CircularProgress } from '@material-ui/core';

const LoadingListings: React.FC = () => (
  <Box display="flex" flexGrow={1} width="100%" justifyContent="center" alignItems="center">
    <CircularProgress />
  </Box>
);

export const MarketplaceListContainer: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingListings />}>
      <MarketplaceList />
    </React.Suspense>
  );
};
