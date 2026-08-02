import React from 'react';

import { AppColorScope } from '@npwd/keyos';

import contactsTheme from '../contacts.theme';

export const ContactsThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={contactsTheme}>{children}</AppColorScope>;
};
