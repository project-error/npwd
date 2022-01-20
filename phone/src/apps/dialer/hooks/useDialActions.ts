import { CallHistoryItem } from '@typings/call';
import { useRecoilCallback } from 'recoil';
import { dialState, useSetHistory } from './state';

interface IUseDialActions {
  saveLocalCall: (callObj: CallHistoryItem) => void;
}

export const useDialActions = (): IUseDialActions => {
  const setHistory = useSetHistory();

  const saveLocalCall = useRecoilCallback(
    ({ snapshot }) =>
      (callObj: CallHistoryItem) => {
        const { state } = snapshot.getLoadable(dialState.history);

        if (state !== 'hasValue') return;

        console.log('callObj', callObj);

        setHistory((curHistory) => [callObj, ...curHistory]);
      },
    [],
  );

  return { saveLocalCall };
};
