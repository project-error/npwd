import React, { useCallback } from 'react';
import MUITextField from '@material-ui/core/TextField';
import MUIInputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { PhoneEvents } from '../../../../typings/phone';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';

const useToggleFocus = () => {
  const Nui = useNuiRequest();
  return useCallback(
    (keepGameFocus: boolean) => {
      Nui.send(PhoneEvents.TOGGLE_KEYS, {
        keepGameFocus,
      });
    },
    [Nui],
  );
};

export const TextField: React.FC<TextFieldProps> = (props) => {
  const toggleKeys = useToggleFocus();
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
  const toggleKeys = useToggleFocus();
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
