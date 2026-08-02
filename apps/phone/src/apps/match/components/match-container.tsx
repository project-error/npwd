import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import ProfileEditor from './views/ProfileEditor';
import MatchPage from './views/MatchPage';
import MatchList from './views/MatchList';
import { useProfile } from '../hooks/useProfile';
import { AppContent } from '../../../ui/components/AppContent';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { useApp } from '../../../os/apps/hooks/useApps';
import MatchBottomNavigation from './BottomNavigation';

const MatchContainer: React.FC = () => {
  const { profile, noProfileExists, setNoProfileExists } = useProfile();
  const match = useApp('MATCH');
  const [activePage, setActivePage] = useState(0);

  const handlePageChange = (e, page) => setActivePage(page);

  useEffect(() => {
    if (!profile) {
      setNoProfileExists(true);
    } else {
      setNoProfileExists(false);
    }
  }, [setNoProfileExists, profile]);

  return (
    <AppWrapper>
      <AppTitle app={match} />
      <AppContent>
        {noProfileExists ? (
          <ProfileEditor />
        ) : (
          <Routes>
            <Route path="/match" element={<MatchPage />} />
            <Route path="/match/matches" element={<MatchList />} />
            <Route path="/match/profile" element={<ProfileEditor />} />
          </Routes>
        )}
      </AppContent>
      <MatchBottomNavigation activePage={activePage} handleChange={handlePageChange} />
    </AppWrapper>
  );
};

export default MatchContainer;
