import { useMemo } from 'react';
import { createTheme } from '@material-ui/core';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import themes from '../../../config/themes.json';

export const usePhoneTheme = () => {
  const [settings] = useSettings();
  return useMemo(() => createTheme(themes[settings.theme.value]), [settings.theme]);
};
