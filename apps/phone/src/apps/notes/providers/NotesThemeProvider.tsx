import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import notesTheme from '../notes.theme';

export const NotesThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={notesTheme}>{children}</AppColorScope>;
};
