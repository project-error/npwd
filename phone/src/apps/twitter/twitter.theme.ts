import { blue, common } from '@material-ui/core/colors';

export const CONTACTS_APP_PRIMARY_COLOR = blue[500];
export const CONTACTS_APP_TEXT_COLOR = common.white;

export interface ITwitterTheme {
  palette: {
    twitter: {
      main: string;
    },
    secondary: {
      main: string;
    }
  }
}

const theme: ITwitterTheme = {
  palette: {
    twitter: {
      main: "#00acee",
    },
    secondary: {
      main: '#999',
    }
  },
};

export default theme;
