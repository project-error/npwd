import React from 'react';
import MUITextField from '@material-ui/core/TextField';
import MUIInputBase from '@material-ui/core/InputBase';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { PhoneEvents } from '../../../../typings/phone';

export const TextField = (props) => {
  const Nui = useNuiRequest();

  const handleFocus = (e) => {
    Nui.send(PhoneEvents.TOGGLE_KEYS, {
      bool: true,
    });
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleUnFocus = (e) => {
    Nui.send(PhoneEvents.TOGGLE_KEYS, {
      bool: false,
    });
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return <MUITextField {...props} onFocus={handleFocus} onBlur={handleUnFocus} />;
};

export const InputBase = (props) => {
  const Nui = useNuiRequest();

  const handleFocus = (e) => {
    Nui.send(PhoneEvents.TOGGLE_KEYS, {
      bool: true,
    });
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleUnFocus = (e) => {
    Nui.send(PhoneEvents.TOGGLE_KEYS, {
      bool: false,
    });
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return <MUIInputBase onFocus={handleFocus} onBlur={handleUnFocus} {...props} />;
};
