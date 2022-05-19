import { grey, common, green } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const DARKCHAT_APP_PRIMARY_COLOR = grey[900];
export const DARKCHAT_APP_TEXT_COLOR = common.white;
export const DARKCHAT_APP_SECONDARY_COLOR = green[500];

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: DARKCHAT_APP_PRIMARY_COLOR,
      dark: grey[900],
      light: grey[100],
      contrastText: DARKCHAT_APP_TEXT_COLOR,
    },
    secondary: {
      main: DARKCHAT_APP_SECONDARY_COLOR,
    },
  },
};

export default theme;
