import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Loader from '../Loader';
import PageText from '../PageText';
import Match from '../matches/Match';
import { useMatches } from '../../hooks/useMatches';
import MatchPagination from '../MatchPagination';
import { useMatchActions } from '../../hooks/useMatchActions';

function MatchList() {
  const [t] = useTranslation();
  const { matches, error } = useMatches();
  const { newMatchesPage } = useMatchActions();

  const [matchPage, setMatchPage] = useState<number>(1);

  const handlePageChange = useCallback(
    (_e: React.ChangeEvent<unknown>, page: number) => {
      setMatchPage(page);
    },
    [setMatchPage],
  );

  useEffect(() => {
    newMatchesPage(matchPage - 1);
  }, [matchPage, newMatchesPage]);

  if (error) return <PageText text={t('MATCH.FEEDBACK.MATCHES_ERROR')} />;
  if (!matches) return <Loader />;
  if (matches.length === 0) return <PageText text={t('MATCH.FEEDBACK.NO_MATCHES')} />;

  const MAX_PAGE_SIZE = 20;
  const totalPageCount = Math.ceil(matches.length / MAX_PAGE_SIZE);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {matches.map((match) => (
          <Match key={match.id} match={match} />
        ))}
      </div>
      <div className="mb-2 flex w-full items-center justify-center">
        {totalPageCount > 1 && (
          <MatchPagination onChange={handlePageChange} totalCount={totalPageCount} />
        )}
      </div>
    </div>
  );
}

export default MatchList;
