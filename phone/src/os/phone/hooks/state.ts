import { atom } from 'recoil';
import { IServerConfig } from '../../../../../typings/config';

export const phoneState = {
  visibility: atom<boolean>({
    key: 'phoneVisibility',
    default: false,
  }),
  phoneConfig: atom<IServerConfig>({
    key: 'phoneConfig',
    default: null,
  }),
  phoneReady: atom<boolean>({
    key: 'phoneReady',
    default: false,
  }),
  phoneTime: atom<string>({
    key: 'phoneTime',
    default: null,
  }),
};
