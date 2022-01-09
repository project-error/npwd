import { useSettings } from './useSettings';
import { isDefaultWallpaper } from '../utils/isDefaultWallpaper';
import getBackgroundPath from '../utils/getBackgroundPath';

export const useWallpaper = () => {
  const [settings] = useSettings();

  return !isDefaultWallpaper(settings.wallpaper.value)
    ? `url(${settings.wallpaper.value})`
    : `url(${getBackgroundPath(settings.wallpaper.value)})`;
};
