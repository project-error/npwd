import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles } from '@material-ui/core';

import Loader from '../Loader';
import PageText from '../PageText';
import Match from '../matches/Match';
import { useMatches } from '../../hooks/useMatches';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
});

function MatchList() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { matches, error } = useMatches();

  if (error) return <PageText text={t('APPS_MATCH_MATCHES_ERROR')} />;
  if (!matches) return <Loader />;
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
