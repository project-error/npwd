import React, { useCallback } from 'react';
import MUITextField from '@material-ui/core/TextField';
import MUIInputBase from '@material-ui/core/InputBase';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { PhoneEvents } from '../../../../typings/phone';

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

export const TextField = (props) => {
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

export const InputBase = (props) => {
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
