import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { simcardState } from './state';
import { useSimcard } from './useSimcard';

export const useSimcardService = () => {
  const setNumber = useSetRecoilState(simcardState.number);
  useNuiEvent('SIMCARD', 'setNumber', setNumber);
  return useSimcard();
};
