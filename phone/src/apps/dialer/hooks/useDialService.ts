import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { dailerState } from './state';
import { useDailHistory } from './useDialHistory';

export const useDailService = () => {
  const setHistory = useSetRecoilState(dailerState.history);
  useNuiEvent('DAILER', 'setHistory', setHistory);

  return useDailHistory();
};
