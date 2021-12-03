import { useRecoilValue } from 'recoil';
import { twitterState } from './state';

interface IProfile {
  profile_name?: string;
  bio?: string;
  job?: string;
  location?: string;
  avatar_url?: string;
}

interface IUseProfile {
  profile: IProfile;
}

export const useProfile = (): IUseProfile => {
  const profile = useRecoilValue(twitterState.profile);
  return {
    profile,
  };
};
