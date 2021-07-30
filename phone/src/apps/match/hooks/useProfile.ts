import { matchState, useMyProfile } from './state';
import { useRecoilValue } from 'recoil';
import { FormattedProfile } from '../../../../../typings/match';

interface UseProfileProps {
  profile: FormattedProfile;
  setProfile: (profile: FormattedProfile) => void;
  noProfileExists: boolean;
}

export const useProfile = (): UseProfileProps => {
  const [profile, setProfile] = useMyProfile();
  const noProfileExists = useRecoilValue(matchState.noProfileExists);

  return { profile, setProfile, noProfileExists };
};
