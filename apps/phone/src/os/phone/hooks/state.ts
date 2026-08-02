import { atom } from 'jotai';
import { ResourceConfig } from '@typings/config';
import { IApp } from '@os/apps/config/apps';

export const phoneState = {
  visibility: atom<boolean>(false),
  resourceConfig: atom<ResourceConfig>(null),
  phoneTime: atom<string>(null),
  isPhoneDisabled: atom<boolean>(false),
  playerSource: atom<number>(0),
  playerIdentifier: atom<string>(null),
  extApps: atom<IApp[]>([]),
};
