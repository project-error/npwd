import React, { useEffect } from 'react';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import ProfileEditor from './views/ProfileEditor';
import { Route } from 'react-router-dom';
import MatchPage from './views/MatchPage';
import MatchList from './views/MatchList';
import { useProfile } from '../hooks/useProfile';

const MatchContainer: React.FC = () => {
  const { profile, noProfileExists, setNoProfileExists } = useProfile();

  useEffect(() => {
    if (!profile) {
      setNoProfileExists(true);
    } else {
      setNoProfileExists(false);
    }
  }, [setNoProfileExists, profile]);

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      {noProfileExists ? (
        <ProfileEditor />
      ) : (
        <>
          <Route path="/match/" exact component={MatchPage} />
          <Route path="/match/matches" exact component={MatchList} />
          <Route path="/match/profile" exact component={ProfileEditor} />
        </>
      )}
    </React.Suspense>
  );
};

export default MatchContainer;
