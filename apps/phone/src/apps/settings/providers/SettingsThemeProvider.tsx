import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import settingsTheme from '../settings.theme';

export const SettingsThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={settingsTheme}>{children}</AppColorScope>;
};
