import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import darkchatTheme from '../darkchat.theme';

export const DarkChatThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppColorScope colors={darkchatTheme}>{children}</AppColorScope>
);
