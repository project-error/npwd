import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles } from '@material-ui/core';

import { useMatches } from '../../hooks/useMatches';
import Loader from '../Loader';
import PageText from '../PageText';
import Match from '../matches/Match';
import Nui from '../../../../os/nui-events/utils/Nui';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
});

const MINIMUM_LOAD_TIME = 1500;

function MatchList() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { matches, error } = useMatches();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Nui.send('phone:getMatches');
    window.setTimeout(() => {
      setLoaded(true);
    }, MINIMUM_LOAD_TIME);
  }, []);

  if (error) return <PageText text={t('APPS_MATCH_MATCHES_ERROR')} />;
  if (!loaded || !matches) return <Loader />;
  if (matches.length === 0) return <PageText text={t('APPS_MATCH_NO_MATCHES')} />;

  return (
    <Box className={classes.root}>
      {matches.map((match) => (
        <Match key={match.id} match={match} />
      ))}
    </Box>
  );
}

export default MatchList;
