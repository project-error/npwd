import { useSettings } from '@/api/hooks/useSettings';
import { darkTheme, lightTheme } from '@/App';
import { setTheme } from '@/utils/theme';
import { useEffect } from 'react';

export const useSyncSettings = () => {
  const { settings } = useSettings();

  useEffect(() => {
    setTheme(settings?.theme === 'dark' ? darkTheme : lightTheme);
  }, [settings?.theme]);
};
