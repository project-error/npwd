import { useAtomValue } from 'jotai';
import { phoneState } from './state';

export const usePlayer = () => {
  return useAtomValue(phoneState.playerSource);
};
