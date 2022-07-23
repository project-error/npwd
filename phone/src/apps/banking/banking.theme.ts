import { ThemeOptions } from '@mui/material';
import { blue } from '@mui/material/colors';
import { CONTACTS_APP_PRIMARY_COLOR, CONTACTS_APP_TEXT_COLOR } from '../contacts/contacts.theme';

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: 'rgb(48,59,91)',
      dark: 'rgb(48,59,91)',
      light: 'rgb(48,59,91)',
      contrastText: CONTACTS_APP_TEXT_COLOR,
    },
    secondary: {
      main: 'rgb(33, 150, 243)',
      light: 'rgb(33, 150, 243)',
      dark: 'rgb(33, 150, 243)',
      contrastText: CONTACTS_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: CONTACTS_APP_TEXT_COLOR,
    },
  },
};

export default theme;
