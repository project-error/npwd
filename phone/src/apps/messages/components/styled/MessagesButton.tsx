import { Button, withStyles } from '@material-ui/core';
import {
  MESSAGES_APP_BG_COLOR,
  MESSAGES_APP_TEXT_COLOR,
} from '../../constants';

export const MessagesButton = withStyles({
  root: {
    '&.MuiButton-containedPrimary:not(.Mui-disabled)': {
      backgroundColor: MESSAGES_APP_BG_COLOR,
      color: MESSAGES_APP_TEXT_COLOR,
    },
    '&.MuiButton-root:hover:not(.MuiButton-containedPrimary) .MuiButton-label': {
      color: MESSAGES_APP_BG_COLOR,
    },
    '&.MuiButton-root:hover.MuiButton-containedPrimary': {
      backgroundColor: MESSAGES_APP_TEXT_COLOR,
      color: MESSAGES_APP_BG_COLOR,
    },
  },
})(Button);
