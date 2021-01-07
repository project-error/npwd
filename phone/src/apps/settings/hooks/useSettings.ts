import Default from '../default.json';
import { useConfig } from '../../../config/hooks/useConfig';
import { atom } from 'recoil';
import { createMuiTheme } from '@material-ui/core';
import useLocalStorage from '../../../os/phone/hooks/useLocalStorage';
import { getStorageItem } from '../../../os/phone/hooks/getLocalStorage';

const settingsState = atom({
  key: 'settings',
  default: Default,
});

export const useSettings = (): any => {
  const theme = getStorageItem('theme');
  const [settings, setSettings] = useLocalStorage();
  const [config] = useConfig();
  const currentTheme = () => createMuiTheme(config.themes[theme]);
  return { settings, setSettings, currentTheme };
};
