import { atom } from 'recoil';
import { ResourceConfig } from '@typings/config';

export const phoneState = {
  visibility: atom<boolean>({
    key: 'phoneVisibility',
    default: false,
  }),
  resourceConfig: atom<ResourceConfig>({
    key: 'resourceConfig',
    default: {} as ResourceConfig,
  }),
  phoneTime: atom<string>({
    key: 'phoneTime',
    default: '',
  }),
  isPhoneDisabled: atom<boolean>({
    key: 'isPhoneDisabled',
    default: false,
  }),
};
