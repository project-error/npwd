import React, { useState } from 'react';
import { MatchThemeProvider } from '../providers/MatchThemeProvider';
import MatchBottomNavigation from '../components/BottomNavigation';
import MatchContainer from './MatchContainer';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const MatchApp = () => {
  const [activePage, setActivePage] = useState(0);

  const handlePageChange = (e, page) => setActivePage(page);

  return (
    <MatchThemeProvider>
      <React.Suspense fallback={<LoadingSpinner />}>
        <MatchContainer />
      </React.Suspense>
      <MatchBottomNavigation activePage={activePage} handleChange={handlePageChange} />
    </MatchThemeProvider>
  );
};
