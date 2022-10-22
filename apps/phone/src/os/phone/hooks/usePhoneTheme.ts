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
