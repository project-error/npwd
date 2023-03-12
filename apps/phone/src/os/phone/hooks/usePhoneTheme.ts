import { useMemo } from 'react';
import { createTheme } from '@mui/material';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { PhoneThemes } from '../../../config/ThemeConfig';
import themeOverrides from '../../../styles/themeOverrides';

export const usePhoneTheme = () => {
  const [settings] = useSettings();
  return useMemo(
    () => createTheme(PhoneThemes[settings.theme.value], themeOverrides),
    [settings.theme],
  );
};

export const usePhoneTheme2 = () => {
  // tailwind with dark class, save to localstorage
  const toggleTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('npwd-colorscheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('npwd-colorscheme', 'light');
    }
  };

  return { toggleTheme };
};
