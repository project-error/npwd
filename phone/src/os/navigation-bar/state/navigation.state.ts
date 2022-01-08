import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const isNavigationDisabled = atom({
  key: 'isNavigationDisabled',
  default: false,
});

export const useSetNavigationDisabled = () => useSetRecoilState(isNavigationDisabled);
export const useNavigationDisabledValue = () => useRecoilValue(isNavigationDisabled);
