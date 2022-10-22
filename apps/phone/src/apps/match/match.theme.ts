import { red, common } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const MATCH_APP_PRIMARY_COLOR = '#FE3B73';
export const MATCH_APP_TEXT_COLOR = common.white;

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: MATCH_APP_PRIMARY_COLOR,
      dark: red[700],
      light: red[300],
      contrastText: MATCH_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#d32f2f',
      light: '#eb4242',
      dark: '#941212',
      contrastText: MATCH_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: MATCH_APP_TEXT_COLOR,
    },
  },
};

export default theme;
