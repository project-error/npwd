import { AppColorTokens } from '@npwd/keyos';

const defaultColors: AppColorTokens = {
  accent: '#3b82f6',
  accentForeground: '#ffffff',
  danger: '#ef4444',
  dangerForeground: '#ffffff',
  muted: '#94a3b8',
  surface: '#11141a',
};

export const usePhoneTheme = (app?: { backgroundColor?: string; color?: string }): AppColorTokens => {
  if (!app?.backgroundColor) return defaultColors;

  return {
    ...defaultColors,
    accent: app.backgroundColor,
    accentForeground: app.color ?? '#ffffff',
    surface: '#11141a',
  };
};

export const DARK_THEME_KEY = 'taso-dark';
