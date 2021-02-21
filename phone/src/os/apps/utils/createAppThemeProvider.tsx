import React, { useMemo } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { deepMergeObjects } from './deepMergeObjects';
import { usePhoneTheme } from '../../phone/hooks/usePhoneTheme';

export function createAppThemeProvider(theme: {} = {}) {
  const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const phoneTheme = usePhoneTheme();
    const mergedTheme = useMemo(() => {
      return createMuiTheme(deepMergeObjects(phoneTheme, theme));
    }, [phoneTheme]);
    return <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>;
  };

  return AppThemeProvider;
}
