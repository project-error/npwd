import { common } from '@mui/material/colors';

export const TWITTER_APP_PRIMARY_COLOR = '#0ea5e9';
export const TWITTER_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: TWITTER_APP_PRIMARY_COLOR,
      dark: '#0ea5e9',
      light: '#0ea5e9',
      contrastText: TWITTER_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#999',
    },
  },
};

export default theme;
