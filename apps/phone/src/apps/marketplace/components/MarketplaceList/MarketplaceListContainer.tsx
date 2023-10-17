import React from 'react';
import { MarketplaceList } from './MarketplaceList';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const MarketplaceListContainer: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <MarketplaceList />
    </React.Suspense>
  );
};
