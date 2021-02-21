import { useMemo } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import * as config from '../../../config/default.json';

export const usePhoneTheme = () => {
  const [settings] = useSettings();

  return useMemo(() => createMuiTheme(config.themes[settings.theme]), [
    settings.theme,
  ]);
};
