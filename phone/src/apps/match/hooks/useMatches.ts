import { useRecoilValue } from 'recoil';
import { matchState } from './state';

import { FormattedMatch } from '../../../../../typings/match';

interface IUseMatches {
  matches: FormattedMatch[];
  error: boolean;
}

export const useMatches = (): IUseMatches => {
  const matches = useRecoilValue<FormattedMatch[]>(matchState.matches);
  const error = useRecoilValue(matchState.errorLoadingMatches);
  return { matches, error };
};
