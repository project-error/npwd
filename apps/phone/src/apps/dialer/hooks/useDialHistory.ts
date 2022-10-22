import { useRecoilValue } from 'recoil';
import { dialState } from './state';

export const useDialHistory = () => useRecoilValue(dialState.history);
