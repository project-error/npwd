import React, { useState } from 'react';

import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import { MatchThemeProvider } from '../providers/MatchThemeProvider';
import MatchBottomNavigation from '../components/BottomNavigation';
import MatchContainer from './MatchContainer';

export const MatchApp = () => {
  const match = useApp('MATCH');
  const [activePage, setActivePage] = useState(0);

  const handlePageChange = (e, page) => setActivePage(page);

  return (
    <MatchThemeProvider>
      <AppWrapper id="contact-app">
        <AppTitle app={match} />
        <AppContent>
          <MatchContainer />
        </AppContent>
        <MatchBottomNavigation activePage={activePage} handleChange={handlePageChange} />
      </AppWrapper>
    </MatchThemeProvider>
  );
};
