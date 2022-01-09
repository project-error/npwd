import { common, green } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const DIALER_APP_PRIMARY_COLOR = green[600];
export const DIALER_APP_TEXT_COLOR = common.white;

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: DIALER_APP_PRIMARY_COLOR,
      dark: green[800],
      light: green[400],
      contrastText: DIALER_APP_TEXT_COLOR,
    },
  },
};

export default theme;
