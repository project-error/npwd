import config from '../../../config/default.json';

export const isDefaultWallpaper = (value: string) => {
  const wallpapers = config.wallpapers;
  for (const wallpaper of wallpapers) {
    if (wallpaper.value === value) return true;
  }
};
