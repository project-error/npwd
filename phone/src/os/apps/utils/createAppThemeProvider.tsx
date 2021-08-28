import React, { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { deepMergeObjects } from './deepMergeObjects';
import { usePhoneTheme } from '../../phone/hooks/usePhoneTheme';

export function createAppThemeProvider(theme: {} = {}) {
  return ({ children }: { children: React.ReactNode }) => {
    const phoneTheme = usePhoneTheme();
    const mergedTheme = useMemo(() => {
      return createTheme(deepMergeObjects(phoneTheme, theme));
    }, [phoneTheme]);
    return <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>;
  };
}
