import Default from '../default.json';
import { useConfig } from '../../../config/hooks/useConfig';
import { atom } from 'recoil';
import { createMuiTheme } from '@material-ui/core';
import useLocalStorage from '../../../os/phone/hooks/useLocalStorage';

const settingsState = atom({
  key: 'settings',
  default: Default,
});

export const useSettings = (): any => {
  const [, , getStorageItem] = useLocalStorage('theme', 'taso-dark');
  const [settings, setSettings] = useLocalStorage();
  const [config] = useConfig();
  const currentTheme = () =>
    createMuiTheme(config.themes[getStorageItem('theme')]);
  return { settings, setSettings, currentTheme };
};
