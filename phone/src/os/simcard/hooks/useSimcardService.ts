import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { simcardState } from './state';
import { useSimcard } from './useSimcard';
import InjectDebugData from '../../debug/InjectDebugData';

InjectDebugData([
  {
    app: 'SIMCARD',
    method: 'setNumber',
    data: '111-1134',
  },
]);

export const useSimcardService = () => {
  const setNumber = useSetRecoilState(simcardState.number);
  useNuiEvent('SIMCARD', 'setNumber', setNumber);
  return useSimcard();
};
