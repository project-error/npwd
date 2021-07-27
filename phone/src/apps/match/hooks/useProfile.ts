import { useRecoilState, useRecoilValue } from 'recoil';
import { matchState, useMyFormattedProfile } from './state';

import { FormattedProfile } from '../../../../../typings/match';

interface IUseProfiles {
  profile: FormattedProfile;
  setProfile: (profile: FormattedProfile) => void;
  noProfileExists: boolean;
}

export const useProfile = (): IUseProfiles => {
  const [profile, setProfile] = useMyFormattedProfile();
  const noProfileExists = useRecoilValue(matchState.noProfileExists);
  return { profile, setProfile, noProfileExists };
};
