import { useRecoilValue, useRecoilState } from 'recoil';
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
  updateProfileLoading: any;
  updateProfileSuccessful: any;
  setUpdateProfileSuccessful: any;
}

export const useProfile = (): IUseProfile => {
  const profile = useRecoilValue(twitterState.profile);
  const updateProfileLoading = useRecoilValue(twitterState.updateProfileLoading);
  const [updateProfileSuccessful, setUpdateProfileSuccessful] = useRecoilState(twitterState.updateProfileSuccess);
  return {
    profile,
    updateProfileLoading,
    updateProfileSuccessful,
    setUpdateProfileSuccessful,
  };
};
