import { BoxProps } from '@material-ui/core';
import { CSSProperties } from 'react';

export interface AppContentTypes {
  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
  backdrop?: boolean;
  onClickBackdrop?: (...args: any[]) => void;
}

export type AppWrapperTypes = BoxProps & {
  id?: string;
  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
  handleClickAway?: (...args: any[]) => void;
};
