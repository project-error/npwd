import { useRecoilValue } from 'recoil';
import { matchState } from './state';

import { Profile } from '../../../../../typings/match';

interface IUseProfiles {
  profiles: Profile[];
}

export const useProfiles = (): IUseProfiles => {
  const profiles = useRecoilValue(matchState.profiles);

  return { profiles };
};
