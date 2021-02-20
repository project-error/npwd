import React, { useMemo } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { deepMergeObjects } from './deepMergeObjects';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import config from './../../../config/default.json';

export function createAppThemeProvider(theme: {} = {}) {
  const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings] = useSettings();
    return (
      <ThemeProvider
        theme={useMemo(() => {
          return createMuiTheme(
            deepMergeObjects(config.themes[settings.theme], theme)
          );
        }, [settings.theme])}
      >
        {children}
      </ThemeProvider>
    );
  };

  return AppThemeProvider;
}
