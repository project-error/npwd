import { useErrorLoadingMatches, useFormattedMatches } from './state';
import { FormattedMatch } from '@typings/match';

interface UseMatchProps {
  matches: FormattedMatch[];
  setMatches: (matches: FormattedMatch[]) => void;
  error: boolean;
}

export const useMatches = (): UseMatchProps => {
  const [matches, setMatches] = useFormattedMatches();
  const error = useErrorLoadingMatches();

  return { matches, setMatches, error };
};
