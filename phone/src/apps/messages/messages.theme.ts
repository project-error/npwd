import { amber, common } from '@material-ui/core/colors';

export const MESSAGES_APP_PRIMARY_COLOR = amber[700];
export const MESSAGES_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: MESSAGES_APP_PRIMARY_COLOR,
      dark: amber[900],
      light: amber[500],
      contrastText: MESSAGES_APP_TEXT_COLOR
    },
  },
};

export default theme;
