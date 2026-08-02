import React from 'react';

import { AppColorScope, AppColorTokens } from '@npwd/keyos';

export function createAppThemeProvider(colors: AppColorTokens) {
  return ({ children }: { children: React.ReactNode }) => (
    <AppColorScope colors={colors}>{children}</AppColorScope>
  );
}
