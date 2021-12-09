import React, { useEffect } from 'react';
import ProfileEditor from './views/ProfileEditor';
import { Route } from 'react-router-dom';
import MatchPage from './views/MatchPage';
import MatchList from './views/MatchList';
import { useProfile } from '../hooks/useProfile';
import { AppContent } from '../../../ui/components/AppContent';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { useApp } from '../../../os/apps/hooks/useApps';

const MatchContainer: React.FC = () => {
  const { profile, noProfileExists, setNoProfileExists } = useProfile();
  const match = useApp('MATCH');

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
          <>
            <Route path="/match/" exact component={MatchPage} />
            <Route path="/match/matches" exact component={MatchList} />
            <Route path="/match/profile" exact component={ProfileEditor} />
          </>
        )}
      </AppContent>
    </AppWrapper>
  );
};

export default MatchContainer;
