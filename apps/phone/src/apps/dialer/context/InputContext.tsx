import { createContext } from 'react';

export interface IDialInputCtx {
  inputVal: string;
  add: (char: string | number) => void;
  removeOne: () => void;
  clear: () => void;
  set: (val) => void;
}

export const DialInputCtx = createContext(null);
