import { matchState, useFormattedMatches } from './state';
import { useRecoilValue } from 'recoil';
import { FormattedMatch } from '@typings/match';

interface UseMatchProps {
  matches: FormattedMatch[];
  setMatches: (matches: FormattedMatch[]) => void;
  error: boolean;
}

export const useMatches = (): UseMatchProps => {
  const [matches, setMatches] = useFormattedMatches();
  const error = useRecoilValue(matchState.errorLoadingMatches);

  return { matches, setMatches, error };
};
