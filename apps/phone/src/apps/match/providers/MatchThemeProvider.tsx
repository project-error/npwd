import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import matchTheme from '../match.theme';

export const MatchThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={matchTheme}>{children}</AppColorScope>;
};
