import { grey, common } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const DARKCHAT_APP_PRIMARY_COLOR = grey[900];
export const DARKCHAT_APP_TEXT_COLOR = common.white;

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: DARKCHAT_APP_PRIMARY_COLOR,
      dark: grey[900],
      light: grey[100],
      contrastText: DARKCHAT_APP_TEXT_COLOR,
    },
  },
};

export default theme;
