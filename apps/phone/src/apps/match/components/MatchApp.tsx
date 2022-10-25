import React from 'react';
import { MatchThemeProvider } from '../providers/MatchThemeProvider';
import MatchContainer from './MatchContainer';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const MatchApp = () => {
  return (
    <MatchThemeProvider>
      <React.Suspense fallback={<LoadingSpinner />}>
        <MatchContainer />
      </React.Suspense>
    </MatchThemeProvider>
  );
};
