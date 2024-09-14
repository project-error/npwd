import { Outlet, useNavigate } from 'react-router-dom';
import { Frame } from './Frame';

import { useEffect } from 'react';
import { setTheme } from './utils/theme';
import { Footer } from './components/Main/Footer';
import { Header } from './components/Main/Header';
import { useNuiEvent } from 'react-fivem-hooks';
import { isEnvBrowser } from './utils/game';
import { closePhone } from './api/phone';
import { useBroadcastEvent } from './hooks/useBroadcastEvent';
import { queryClient } from './Providers';
import { useCurrentDevice } from './api/hooks/useCurrentDevice';

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
  const navigate = useNavigate();
  const currentDevice = useCurrentDevice();

  useEffect(() => {
    localStorage.getItem('theme') === JSON.stringify(darkTheme)
      ? setTheme(darkTheme)
      : setTheme(lightTheme);

    localStorage.setItem('is-loaded', 'true');

    return () => {
      localStorage.removeItem('is-loaded');
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePhone();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const { data: isOpen } = useNuiEvent<boolean>({
    event: 'SET_PHONE_OPEN',
    defaultValue: isEnvBrowser(),
  });

  useBroadcastEvent('active-call:updated', (data) => {
    queryClient.setQueryData(['active-call'], { payload: data });
    if (data) {
      navigate('/apps/calls/call');
    }
  });

  /**
   * If there is no device, we should not render anything.
   * This is a safety check to ensure that the app does not render
   * if the device is not found.
   */
  if (!currentDevice) {
    console.warn('No device found - Nothing to render.');
    closePhone();
    return null;
  }

  if (!isOpen) {
    return null;
  }

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
