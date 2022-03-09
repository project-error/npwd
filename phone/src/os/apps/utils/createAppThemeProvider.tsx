import React, { useMemo } from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider, ThemeOptions } from '@mui/material';
import { deepMergeObjects } from '@shared/deepMergeObjects';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';

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
