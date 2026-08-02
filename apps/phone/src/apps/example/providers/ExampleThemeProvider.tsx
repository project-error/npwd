import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import exampleTheme from '../example.theme';

export const ExampleThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={exampleTheme}>{children}</AppColorScope>;
};
