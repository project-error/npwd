import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import { MatchThemeProvider } from '../providers/MatchThemeProvider';
import MatchBottomNavigation from '../components/BottomNavigation';
import MatchPage from './views/MatchPage';
import ProfileEditor from './views/ProfileEditor';
import MatchList from './views/MatchList';
import { MatchEvents } from '../../../../../typings/match';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';
import { useMyProfileValue, useProfileExists } from '../hooks/state';
import { fetchNui } from '../../../utils/fetchNui';

export const MatchApp = () => {
  const match = useApp('MATCH');
  const [activePage, setActivePage] = useState(0);
  const [noProfileExists, setNoProfileExists] = useProfileExists();
  const myProfile = useMyProfileValue();

  useEffect(() => {
    fetchNui(MatchEvents.INITIALIZE).then(() => console.log('Updated last activity'));
  }, []);

  useEffect(() => {
    if (!myProfile) {
      setNoProfileExists(true);
    } else {
      setNoProfileExists(false);
    }
  }, [myProfile, setNoProfileExists]);

  const handlePageChange = (e, page) => setActivePage(page);

  return (
    <MatchThemeProvider>
      <AppWrapper id="contact-app">
        <AppTitle app={match} />
        {noProfileExists ? (
          <AppContent>
            <React.Suspense fallback={<LoadingSpinner />}>
              <ProfileEditor />
            </React.Suspense>
          </AppContent>
        ) : (
          <>
            <AppContent>
              <React.Suspense fallback={<LoadingSpinner />}>
                <Route path="/match/" exact component={MatchPage} />
                <Route path="/match/matches" exact component={MatchList} />
                <Route path="/match/profile" exact component={ProfileEditor} />
              </React.Suspense>
            </AppContent>
            <MatchBottomNavigation activePage={activePage} handleChange={handlePageChange} />
          </>
        )}
      </AppWrapper>
    </MatchThemeProvider>
  );
};
