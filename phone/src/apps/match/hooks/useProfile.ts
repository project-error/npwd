import { useRecoilState, useRecoilValue } from 'recoil';
import { matchState } from './state';

import { FormattedProfile } from '../../../../../typings/match';

interface IUseProfiles {
  profile: FormattedProfile;
  setProfile: (profile: FormattedProfile) => void;
}

export const useProfile = (): IUseProfiles => {
  const [profile, setProfile] = useRecoilState<FormattedProfile>(matchState.myProfile);
  return { profile, setProfile };
};
