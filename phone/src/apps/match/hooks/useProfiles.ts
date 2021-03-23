import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { matchState } from './state';

import { FormattedProfile, Like } from '../../../../../typings/match';
import Nui from '../../../os/nui-events/utils/Nui';

interface IUseProfiles {
  profiles: FormattedProfile[];
  activeProfile: FormattedProfile | null;
  setViewed: (index: number, liked: boolean) => void;
  error: boolean;
}

export const useProfiles = (): IUseProfiles => {
  const [profiles, setProfiles] = useRecoilState(matchState.profiles);
  const error = useRecoilValue(matchState.errorLoadingProfiles);

  const setViewed = (id: number, liked: boolean) => {
    setProfiles((profiles) =>
      profiles.map((profile) => {
        if (id === profile.id) return { ...profile, viewed: true, liked };
        return profile;
      }),
    );

    Nui.send('phone:saveLikes', [{ id, liked }]);
  };

  const filteredProfiles = profiles ? profiles.filter((profile) => !profile.viewed) : null;
  const activeProfile = profiles ? filteredProfiles[0] : null;

  return { profiles, activeProfile, error, setViewed };
};
