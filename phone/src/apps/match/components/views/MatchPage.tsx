import React, { useEffect, useState, useRef } from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { useProfiles } from '../../hooks/useProfiles';
import Loader from '../Loader';
import PageText from '../PageText';
import ActiveProfile from '../ActiveProfile';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
});

const MINIMUM_LOAD_TIME = 1500;

const MatchPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { profiles, error, activeProfile, setViewed } = useProfiles();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      setLoaded(true);
    }, MINIMUM_LOAD_TIME);
  }, []);

  const handleSwipe = (id: number, liked: boolean) => {
    // the user didn't choose (didn't swipe far enough)
    if (liked === null) return;

    setViewed(id, liked);
  };

  if (error) return <PageText text={t('APPS_MATCH_PROFILES_ERROR')} />;
  if (!loaded || !profiles) return <Loader />;
  if (!activeProfile) return <PageText text={t('APPS_MATCH_NO_PROFILES')} />;

  return (
    <Paper className={classes.root} square>
      <ActiveProfile profile={activeProfile} onSwipe={handleSwipe} />
    </Paper>
  );
};

export default MatchPage;
