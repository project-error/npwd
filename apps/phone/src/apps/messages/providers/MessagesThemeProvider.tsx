import React from 'react';
import { AppColorScope } from '@npwd/keyos';
import messagesTheme from '../messages.theme';

export const MessagesThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppColorScope colors={messagesTheme}>{children}</AppColorScope>;
};
