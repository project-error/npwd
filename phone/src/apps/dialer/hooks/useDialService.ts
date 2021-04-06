import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { dialState } from './state';
import { CallEvents } from '../../../../../typings/call';

export const useDialService = () => {
  const setHistory = useSetRecoilState(dialState.history);
  useNuiEvent('DIALER', CallEvents.SET_CALL_HISTORY, setHistory);
};
