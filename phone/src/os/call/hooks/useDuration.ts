import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { callerState } from './state';

export const useDuration = () => {
  const [duration, setDuration] = useRecoilState(callerState.callDuration);

  const resetDuration = useCallback(
    () => setDuration({ ms: 0, s: 0, m: 0, h: 0 }),
    [setDuration]
  );

  return { duration, setDuration, resetDuration };
};
