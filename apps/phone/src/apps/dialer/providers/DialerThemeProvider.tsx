import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import dialerTheme from '../dialer.theme';

export const DialerThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={dialerTheme}>{children}</AppColorScope>;
};
