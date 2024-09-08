import { Outlet } from 'react-router-dom';
import { Frame } from './Frame';

import { useEffect } from 'react';
import { setTheme } from './utils/theme';
import { Footer } from './components/Main/Footer';
import { Header } from './components/Main/Header';

export const lightTheme = {
  textColor: {
    primary: '#000',
    secondary: '#222',
  },
  backgroundColor: {
    primary: '#fff',
    secondary: '#eee',
  },
};

export const darkTheme = {
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
  useEffect(() => {
    localStorage.getItem('theme') === JSON.stringify(darkTheme)
      ? setTheme(darkTheme)
      : setTheme(lightTheme);
  }, []);

  return (
    <Frame>
      <main className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <section className="w-full overflow-auto h-full flex-1 flex flex-col">
          <Outlet />
        </section>

        <Footer />
      </main>
    </Frame>
  );
}

export default App;
