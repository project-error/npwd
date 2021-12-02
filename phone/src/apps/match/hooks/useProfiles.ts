import { useRecoilValue } from 'recoil';
import { matchState, useFormattedProfiles } from './state';

import { FormattedProfile } from '@typings/match';

interface UseProfilesProps {
  profiles: FormattedProfile[];
  activeProfile: FormattedProfile | null;
  error: boolean;
}

export const useProfiles = (): UseProfilesProps => {
  const [profiles] = useFormattedProfiles();
  const error = useRecoilValue(matchState.errorLoadingProfiles);

  const filteredProfiles = profiles ? profiles.filter((profile) => !profile.viewed) : null;
  const activeProfile = profiles ? filteredProfiles[0] : null;

  return { profiles, activeProfile, error };
};
