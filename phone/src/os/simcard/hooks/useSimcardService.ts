import { useSetRecoilState } from 'recoil';
import { simcardState } from './state';
import { useSimcard } from './useSimcard';
import InjectDebugData from '../../debug/InjectDebugData';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { PhoneEvents } from '../../../../../typings/phone';

InjectDebugData([
  {
    app: 'SIMCARD',
    method: 'setNumber',
    data: '111-1134',
  },
]);

export const useSimcardService = () => {
  const setNumber = useSetRecoilState(simcardState.number);
  useNuiEvent('SIMCARD', PhoneEvents.SET_NUMBER, setNumber);
  return useSimcard();
};
