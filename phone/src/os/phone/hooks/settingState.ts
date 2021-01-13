import { atom } from 'recoil';

export const phoneSettings = {
  theme: atom({
    key: 'settingTheme',
    default: 'default-dark',
  }),
  zoom: atom({
    key: 'settingZoom',
    default: '100%',
  }),
};
