import { atom } from 'recoil';
import { CallHistoryItem } from '../../../../../typings/call';

export const dialState = {
  history: atom<CallHistoryItem[]>({
    key: 'dialHistory',
    default: [],
  }),
};
