import React, { forwardRef } from 'react';
import MUITextField, { TextFieldProps } from '@mui/material/TextField';
import MUIInputBase, { InputBaseProps } from '@mui/material/InputBase';
import { PhoneEvents } from '@typings/phone';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';

const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(PhoneEvents.TOGGLE_KEYS, {
    keepGameFocus,
  }).catch((e) => (isEnvBrowser() ? () => {} : console.error(e)));

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
  <MUITextField
    ref={ref}
    {...props}
    variant={props.variant ?? 'standard'}
    onFocus={(e) => {
      toggleKeys(false);
      if (props.onFocus) {
        props.onFocus(e);
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
    onFocus={(e) => {
      toggleKeys(false);
      if (props.onFocus) {
        props.onFocus(e);
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
