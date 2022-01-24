import React, { useMemo } from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider, ThemeOptions } from '@mui/material';
import { deepMergeObjects } from './deepMergeObjects';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';

export function createAppThemeProvider(theme: ThemeOptions = {}) {
  return ({ children }: { children: React.ReactNode }) => {
    const phoneTheme = usePhoneTheme();
    const mergedTheme = useMemo(() => {
      return createTheme(deepMergeObjects(phoneTheme, theme));
    }, [phoneTheme]);

    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    );
  };
}
