import { Link } from 'react-router-dom';
import { setTheme } from '../../utils/theme';
import { darkTheme, lightTheme } from '../../App';

export const SettingsApp = () => {
  const toggleTheme = () => {
    const rootElement = document.getElementById('root')!;
    const currentTheme =
      rootElement.style.getPropertyValue('--bg-primary') === lightTheme.backgroundColor.primary
        ? darkTheme
        : lightTheme;

    setTheme(currentTheme);
  };

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
