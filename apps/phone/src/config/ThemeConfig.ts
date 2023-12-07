import { ThemeOptions } from '@mui/material';

// Configure all of the phone's default themes here.
export const PhoneThemes: Record<string, ThemeOptions> = {
  'taso-dark': {
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
        primary: 'rgba(255, 255, 255, 0.9)',
        secondary: 'rgba(200, 200, 200, 0.9)',
        disabled: 'rgba(200, 200, 200, 0.5)',
      },
    },
  },
  'default-light': {
    typography: {
      fontFamily: "'SegoeUI', 'Roboto', 'Arial', sans-serif",
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#607D8B',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.9)',
        secondary: 'rgba(20, 20, 20, 0.9)',
        disabled: 'rgba(20, 20, 20, 0.5)',
      },
    },
  },
};
