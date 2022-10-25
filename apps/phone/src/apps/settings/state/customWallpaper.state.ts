import { atom, useRecoilState } from 'recoil';

const customWallpaperState = atom({
  key: 'customWallpaperState',
  default: false,
});

export const useCustomWallpaperModal = () => useRecoilState(customWallpaperState);
