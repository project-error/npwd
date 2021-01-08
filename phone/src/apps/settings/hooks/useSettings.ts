import Default from '../default.json';
import { useConfig } from '../../../config/hooks/useConfig';
import { atom } from 'recoil';
import { createMuiTheme } from '@material-ui/core';
import useLocalStorage, {
  getStorage,
} from '../../../os/phone/hooks/useLocalStorage';

const settingsState = atom({
  key: 'settings',
  default: Default,
});

export const useSettings = (): any => {
  const theme = getStorage('theme');
  const [config] = useConfig();
  const currentTheme = () => createMuiTheme(config.themes[theme]);
  return { currentTheme };
};
