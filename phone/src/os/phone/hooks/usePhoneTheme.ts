import { useMemo } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import themes from '../../../config/themes.json';

export const usePhoneTheme = () => {
  const { settings } = useSettings();
  return useMemo(() => createMuiTheme(themes[settings.theme.value]), [settings.theme]);
};
