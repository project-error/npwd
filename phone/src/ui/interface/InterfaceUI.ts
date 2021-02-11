import { CSSProperties } from 'react';

export interface AppContentTypes {
  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
  backdrop?: boolean;
  onClickBackdrop?: (...args: any[]) => void;
}

export interface AppWrapperTypes {
  id?: string;
  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
  handleClickAway?: (...args: any[]) => void;
}

export interface ISnackbar {
  message: string;
  type: 'success' | 'error'
}