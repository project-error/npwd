import { atom, useAtom } from 'jotai';

const customWallpaperState = atom(false);

export const useCustomWallpaperModal = () => useAtom(customWallpaperState);
