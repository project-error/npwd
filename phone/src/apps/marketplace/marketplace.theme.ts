import { common, grey, red } from '@mui/material/colors';
import { ICreateAppTheme } from '@os/apps/utils/createAppThemeProvider';

export const MARKETPLACE_APP_PRIMARY_COLOR = red[500];
export const MARKETPLACE_APP_ICON_COLOR = common.white;
export const MARKETPLACE_APP_TEXT_COLOR = common.black;

const theme: ICreateAppTheme = {
  dark: {
    palette: {
      mode: 'dark',
      primary: {
        dark: '#f5b3a2',
        light: '#ffc4c4',
        main: '#ffded5',
      },
      background: {
        paper: grey[900],
      },
    },
  },
  light: {
    palette: {
      mode: 'light',
      primary: {
        dark: '#f27654',
        light: '#f27654',
        main: '#f27654',
      },
    },
  },
};

export default theme;
