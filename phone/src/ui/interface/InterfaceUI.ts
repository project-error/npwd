import { CSSProperties } from 'react';

export interface AppContentTypes {
  children?: JSX.Element | JSX.Element[];
  paperStyle?: CSSProperties;
  disableSuspenseHandler?: boolean;
  backdrop?: boolean;
  onClickBackdrop?: (...args: any[]) => void;
}

export interface AppWrapperTypes {
  id?: string;
  style?: CSSProperties;
  handleClickAway?: (...args: any[]) => void;
}
