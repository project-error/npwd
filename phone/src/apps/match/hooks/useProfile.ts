import { useMyProfile, useProfileExists } from './state';
import { FormattedProfile } from '@typings/match';

interface UseProfileProps {
  profile: FormattedProfile;
  setProfile: (profile: FormattedProfile) => void;
  noProfileExists: boolean;
  setNoProfileExists: (exists: boolean) => void;
}

export const useProfile = (): UseProfileProps => {
  const [profile, setProfile] = useMyProfile();
  const [noProfileExists, setNoProfileExists] = useProfileExists();

  return { profile, setProfile, noProfileExists, setNoProfileExists };
};
