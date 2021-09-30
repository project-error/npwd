import React, { useMemo } from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material';
import { deepMergeObjects } from './deepMergeObjects';
import { usePhoneTheme } from '../../phone/hooks/usePhoneTheme';

export function createAppThemeProvider(theme: {} = {}) {
  return ({ children }: { children: React.ReactNode }) => {
    const phoneTheme = usePhoneTheme();
    const mergedTheme = useMemo(() => {
      return createTheme(adaptV4Theme(deepMergeObjects(phoneTheme, theme)));
    }, [phoneTheme]);
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    );
  };
}
