import { common } from '@material-ui/core/colors';

export const TWITTER_APP_PRIMARY_COLOR = '#00acee';
export const TWITTER_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: TWITTER_APP_PRIMARY_COLOR,
      dark: '#0488ba',
      light: '#3dbbeb',
      contrastText: TWITTER_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#999',
    },
  },
};

export default theme;
