import { useRecoilValue } from 'recoil';
import { simcardState } from './state';

export const useMyPhoneNumber = () => useRecoilValue(simcardState.number);
