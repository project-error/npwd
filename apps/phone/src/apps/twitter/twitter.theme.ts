import { common } from '@mui/material/colors';

export const TWITTER_APP_PRIMARY_COLOR = '#ff5455';
export const TWITTER_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: TWITTER_APP_PRIMARY_COLOR,
      dark: '#ff5455',
      light: '#ff5455',
      contrastText: TWITTER_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#999',
    },
  },
};

export default theme;
