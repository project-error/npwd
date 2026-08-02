import { useTwitterProfileValue } from './state';

interface IProfile {
  profile_name?: string;
  avatar_url?: string;
}

interface IUseProfile {
  profile: IProfile;
}

export const useProfile = (): IUseProfile => {
  const profile = useTwitterProfileValue();
  return {
    profile,
  };
};
