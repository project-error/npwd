import React from 'react';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import { deepMergeObjects } from './deepMergeObjects';

export interface ICreateAppTheme extends ThemeOptions {
  dark?: ThemeOptions;
  light?: ThemeOptions;
}

export function createAppThemeProvider(themes: ICreateAppTheme) {
  return ({ children }: { children: React.ReactNode }) => {
    const phoneTheme = usePhoneTheme();
    const rawTheme = phoneTheme.palette.mode === 'dark' ? themes.dark : themes.light;
    const mergedTheme = deepMergeObjects({}, phoneTheme, rawTheme ?? themes);

    return (
      <ThemeProvider theme={createTheme(mergedTheme)} key="custom">
        {children}
      </ThemeProvider>
    );
  };
}
