import { useMemo } from 'react';
import { createTheme, adaptV4Theme } from '@mui/material';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import themes from '../../../config/themes.json';

export const usePhoneTheme = () => {
  const [settings] = useSettings();
  return useMemo(() => createTheme(adaptV4Theme(themes[settings.theme.value])), [settings.theme]);
};
