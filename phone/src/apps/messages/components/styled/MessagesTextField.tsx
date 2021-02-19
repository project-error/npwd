import { TextField, withStyles } from '@material-ui/core';
import { MESSAGES_APP_BG_COLOR } from '../../constants';

export const MessagesTextField = withStyles({
  root: {
    '& .MuiInput-underline:after': {
      borderBottom: `2px solid ${MESSAGES_APP_BG_COLOR}`,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: MESSAGES_APP_BG_COLOR,
    },
  },
})(TextField);
