import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { dialState } from './state';
import { useDialHistory } from './useDialHistory';

export const useDialService = () => {
  const setHistory = useSetRecoilState(dialState.history);
  useNuiEvent('DAILER', 'setHistory', setHistory);

  return useDialHistory();
};
