import { common, red } from '@mui/material/colors';

export const MARKETPLACE_APP_PRIMARY_COLOR = red[500];
export const MARKETPLACE_APP_ICON_COLOR = common.white;
export const MARKETPLACE_APP_TEXT_COLOR = common.black;

const theme = {
  palette: {
    primary: {
      main: MARKETPLACE_APP_PRIMARY_COLOR,
      dark: red[700],
      light: red[200],
      contrastText: MARKETPLACE_APP_TEXT_COLOR,
    },
  },
};

export default theme;
