import { useAtomValue } from 'jotai';
import { simcardState } from './state';

export const useMyPhoneNumber = () => useAtomValue(simcardState.number);
