import { useRecoilState } from 'recoil';
import { callerState } from './state';

export const useDuration = () => {
  const [duration, setDuration] = useRecoilState(callerState.callDuration);
  return { duration, setDuration}
}