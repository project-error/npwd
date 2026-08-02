import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import twitterTheme from '../twitter.theme';

export const TwitterThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={twitterTheme}>{children}</AppColorScope>;
};
