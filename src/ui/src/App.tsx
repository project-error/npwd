import { Link, Outlet } from 'react-router-dom';
import { Frame } from './Frame';

import { useEffect } from 'react';
import { setTheme } from './utils/theme';

const lightTheme = {
  textColor: {
    primary: '#000',
    secondary: '#222',
  },
  backgroundColor: {
    primary: '#fff',
    secondary: '#eee',
  },
};

const darkTheme = {
  textColor: {
    primary: '#fff',
    secondary: '#ddd',
  },
  backgroundColor: {
    primary: '#121212',
    secondary: '#222',
  },
};

function App() {
  const toggleTheme = () => {
    const rootElement = document.getElementById('root')!;
    const currentTheme =
      rootElement.style.getPropertyValue('--bg-primary') === lightTheme.backgroundColor.primary
        ? darkTheme
        : lightTheme;

    setTheme(currentTheme);
  };

  useEffect(() => {
    setTheme(lightTheme);
  }, []);

  return (
    <Frame>
      <main className="flex flex-col gap-2 flex-1">
        <header className="h-8 bg-slate-400 text-secondary px-6 flex gap-4">
          (This is the header)
        </header>

        <Outlet />

        <button className="border p-4 rounded-lg m-8" onClick={toggleTheme}>
          toggle theme
        </button>

        <footer className="h-8 bg-slate-400 text-secondary px-6 flex gap-4 items-center mt-auto">
          <Link to="/home">Home</Link>
        </footer>
      </main>
    </Frame>
  );
}

export default App;
