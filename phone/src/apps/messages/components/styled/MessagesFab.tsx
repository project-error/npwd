import { Fab, withStyles } from '@material-ui/core';
import {
  MESSAGES_APP_BG_COLOR,
  MESSAGES_APP_TEXT_COLOR,
} from '../../constants';

export const MessagesFab = withStyles({
  root: {
    '&.MuiFab-primary': {
      backgroundColor: MESSAGES_APP_BG_COLOR,
      color: MESSAGES_APP_TEXT_COLOR,
    },
  },
})(Fab);
