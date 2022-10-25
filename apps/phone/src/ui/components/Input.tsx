import React, { forwardRef } from 'react';
import MUITextField, { TextFieldProps } from '@mui/material/TextField';
import MUIInputBase, { InputBaseProps } from '@mui/material/InputBase';
import { PhoneEvents } from '@typings/phone';
import fetchNui from '@utils/fetchNui';

export const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(
    PhoneEvents.TOGGLE_KEYS,
    {
      keepGameFocus,
    },
    {},
  );

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
  <MUITextField
    ref={ref}
    {...props}
    variant={props.variant ?? 'standard'}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />
));

export const InputBase: React.FC<InputBaseProps> = forwardRef((props, ref) => (
  <MUIInputBase
    ref={ref}
    {...props}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />
));
