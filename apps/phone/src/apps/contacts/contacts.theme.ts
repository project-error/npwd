import { blue, common } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const CONTACTS_APP_PRIMARY_COLOR = blue[500];
export const CONTACTS_APP_TEXT_COLOR = common.white;

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: CONTACTS_APP_PRIMARY_COLOR,
      dark: blue[700],
      light: blue[300],
      contrastText: CONTACTS_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#d32f2f',
      light: '#eb4242',
      dark: '#941212',
      contrastText: CONTACTS_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: CONTACTS_APP_TEXT_COLOR,
    },
  },
};

export default theme;
