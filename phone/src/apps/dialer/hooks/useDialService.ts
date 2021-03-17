import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { dialState } from './state';

export const useDialService = () => {
  const setHistory = useSetRecoilState(dialState.history);
  useNuiEvent('DIALER', 'setHistory', setHistory);
};
