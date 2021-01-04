import { useRecoilState } from 'recoil';
import { phoneState } from './state';

export const useForceUpdate = () => {
  const [update, setUpdate] = useRecoilState(phoneState.forceUpdateState);
  return { update, setUpdate };
};
