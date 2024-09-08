import { Link } from 'react-router-dom';
import { setTheme } from '../../../utils/theme';
import { darkTheme, lightTheme } from '../../../App';

export const Footer = () => {
  const toggleTheme = () => {
    const rootElement = document.getElementById('root')!;
    const currentTheme =
      rootElement.style.getPropertyValue('--bg-primary') === lightTheme.backgroundColor.primary
        ? darkTheme
        : lightTheme;

    setTheme(currentTheme);
  };

  return (
    <footer className="h-8 bg-secondary text-secondary px-6 flex gap-4 items-center mt-auto">
      <Link to="/home">Home</Link>

      <button onClick={toggleTheme} className="rounded-lg bg-primary px-2">
        toggle theme
      </button>
    </footer>
  );
};
