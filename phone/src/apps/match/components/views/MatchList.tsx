import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import Loader from '../Loader';
import PageText from '../PageText';
import Match from '../matches/Match';
import { useMatches } from '../../hooks/useMatches';
import MatchPagination from '../MatchPagination';
import { useMatchActions } from '../../hooks/useMatchActions';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});

function MatchList() {
  const classes = useStyles();
  const [t] = useTranslation();
  const { matches, error } = useMatches();
  const { newMatchesPage } = useMatchActions();

  const [matchPage, setMatchPage] = useState<number>(1);

  const handlePageChange = useCallback(
    (e: React.ChangeEvent<unknown>, page: number) => {
      setMatchPage(page);
    },
    [setMatchPage],
  );

  useEffect(() => {
    newMatchesPage(matchPage - 1);
  }, [matchPage]);

  if (error) return <PageText text={t('MATCH.FEEDBACK.MATCHES_ERROR')} />;
  if (!matches) return <Loader />;
  if (matches.length === 0) return <PageText text={t('MATCH.FEEDBACK.NO_MATCHES')} />;

  const MAX_PAGE_SIZE = 20;
  const totalPageCount = Math.ceil(matches.length / MAX_PAGE_SIZE);

  return (
    <Box className={classes.root}>
      <Box>
        {matches.map((match) => (
          <Match key={match.id} match={match} />
        ))}
      </Box>
      <Box mb={2} width="100%" display="flex" justifyContent="center" alignItems="center">
        {totalPageCount > 1 && (
          <MatchPagination onChange={handlePageChange} totalCount={totalPageCount} />
        )}
      </Box>
    </Box>
  );
}

export default MatchList;
