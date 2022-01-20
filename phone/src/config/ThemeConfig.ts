import { ThemeOptions } from '@mui/material';

// Configure all of the phone's default themes here.
export const PhoneThemes: Record<string, ThemeOptions> = {
  'taso-dark': {
    typography: {
      fontFamily: "'SegoeUI', 'Roboto', 'Arial', sans-serif",
    },
    components: {
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#a6d4fa',
      },
      text: {
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
      },
    },
  },
  'default-light': {
    typography: {
      fontFamily: "'SegoeUI', 'Roboto', 'Arial', sans-serif",
    },
    palette: {
      mode: 'light',
    },
  },
};
