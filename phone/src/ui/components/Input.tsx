import React from 'react';
import MUITextField from '@material-ui/core/TextField';
import MUIInputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { PhoneEvents } from '../../../../typings/phone';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';
import { noop } from '../../../../resources/utils/misc';

const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(PhoneEvents.TOGGLE_KEYS, {
    keepGameFocus,
  }).catch((e) => (isEnvBrowser() ? noop : console.error(e)));

export const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <MUITextField
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
  );
};

export const InputBase: React.FC<InputBaseProps> = (props) => {
  return (
    <MUIInputBase
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
  );
};
