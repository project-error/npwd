import { amber, common } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const MESSAGES_APP_PRIMARY_COLOR = amber[800];
export const MESSAGES_APP_TEXT_COLOR = common.white;

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: MESSAGES_APP_PRIMARY_COLOR,
      dark: amber[900],
      light: amber[100],
      contrastText: MESSAGES_APP_TEXT_COLOR,
    },
  },
};

export default theme;
