import { common, red } from '@material-ui/core/colors';

export const SELLOUT_APP_PRIMARY_COLOR = red[500];
export const SELLOUT_APP_ICON_COLOR = common.white;
export const SELLOUT_APP_TEXT_COLOR = common.black;

const theme = {
  palette: {
    primary: {
      main: SELLOUT_APP_PRIMARY_COLOR,
      dark: red[700],
      light: red[200],
      contrastText: SELLOUT_APP_TEXT_COLOR,
    },
  },
};

export default theme;
