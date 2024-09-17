import { Link } from 'react-router-dom';

import { darkTheme, lightTheme } from '../../App';
import { useEffect, useState } from 'react';
import { setTheme } from '@/utils/theme';

export const SettingsApp = () => {
  const [themeState, setThemeState] = useState(() => {
    return localStorage.getItem('theme-type') === 'dark' ? darkTheme : lightTheme;
  });

  const toggleTheme = () => {
    const otherTheme = themeState.type === lightTheme.type ? darkTheme : lightTheme;
    console.log('toggle theme', otherTheme, themeState);
    setThemeState(otherTheme);
  };

  useEffect(() => {
    setTheme(themeState);
  }, [themeState]);

  return (
    <div className="p-8 h-full w-full bg-primary text-primary flex flex-col gap-8">
      <span>Settings</span>
      <span>⚙️</span>

      <button onClick={toggleTheme}>toggle theme</button>

      <Link to="/home">
        <button className="border px-4 py-2 rounded-sm">
          <span>Go Home</span>
        </button>
      </Link>
    </div>
  );
};
