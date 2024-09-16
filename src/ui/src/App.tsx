import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Frame } from './Frame';

import { useEffect } from 'react';
import { setTheme, Theme } from './utils/theme';
import { Footer } from './components/Main/Footer';
import { Header } from './components/Main/Header';
import { useNuiEvent } from 'react-fivem-hooks';
import { isEnvBrowser } from './utils/game';
import { closePhone } from './api/phone';
import { useBroadcastEvent } from './hooks/useBroadcastEvent';
import { queryClient } from './Providers';
import { useCurrentDevice } from './api/hooks/useCurrentDevice';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useKeys } from './hooks/useKeys';
import { useThemeType } from './hooks/useTheme';
import { Message } from '../../shared/Types';

export const lightTheme: Theme = {
  type: 'light',
  textColor: {
    primary: '#000',
    secondary: '#222',
  },
  backgroundColor: {
    primary: '#fff',
    secondary: '#eee',
  },
};

export const darkTheme: Theme = {
  type: 'dark',
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentDevice = useCurrentDevice();
  const y = useMotionValue(0);

  const opacity = useTransform(y, [-200, -50, 0], [0, 1, 1]);
  const scale = useTransform(y, [-200, -50, 0], [0.8, 1, 1]);

  const currentThemeType = useThemeType();

  useEffect(() => {
    if (currentThemeType === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }

    localStorage.setItem('is-loaded', 'true');

    return () => {
      localStorage.removeItem('is-loaded');
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

  useKeys({
    Escape: () => {
      closePhone();
      navigate(-1);
    },
  });

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home');
    }
  }, [location.pathname]);

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
      <motion.div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <motion.div
          className="w-full overflow-auto h-full flex-1 flex flex-col"
          style={{ scale, opacity }}
          initial={{ y: -200 }}
          animate={{ y: 0 }}
        >
          <Outlet />
        </motion.div>

        <Footer y={y} />
      </motion.div>
    </Frame>
  );
}

export default App;
