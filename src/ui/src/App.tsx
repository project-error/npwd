import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Frame } from './Frame';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Component, ReactNode, useEffect } from 'react';
import { useNuiEvent } from 'react-fivem-hooks';
import { useCurrentDevice } from './api/hooks/useCurrentDevice';
import { closePhone } from './api/phone';
import { Footer } from './components/Main/Footer';
import { Header } from './components/Main/Header';
import { useDisableNavigation } from './contexts/NavigationContext';
import { useBroadcastEvent } from './hooks/useBroadcastEvent';
import { useKeys } from './hooks/useKeys';
import { useThemeType } from './hooks/useTheme';
import { queryClient } from './Providers';
import { isEnvBrowser } from './utils/game';
import { setTheme, Theme } from './utils/theme';
import { useActiveCall } from './api/hooks/useActiveCall';
import { useMessagesNotifications } from './api/hooks/useMessagesNotifications';

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
  useActiveCall();
  useMessagesNotifications();

  const location = useLocation();
  const navigate = useNavigate();
  const currentDevice = useCurrentDevice();
  const y = useMotionValue(0);
  const isNavigationDisabled = useDisableNavigation();

  const opacity = useTransform(y, [-200, -50, 0], [0, 1, 1]);
  const scale = useTransform(y, [-200, -50, 0], [0.8, 1, 1]);
  const borderRadius = useTransform(y, [-150, -40, 0], [40, 0, 0]);
  const currentThemeType = useThemeType();

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('----------');
      console.log('message received');
      console.log(event);
      console.log('----------');
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
      if (isNavigationDisabled) return;
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
      <motion.div className="flex flex-col flex-1 overflow-hidden bg-primary text-primary">
        <Header />

        <motion.div
          className="w-full overflow-auto h-full flex-1 flex flex-col"
          style={{ scale, opacity, borderRadius }}
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

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}
class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state: { hasError: boolean };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught an error:', error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.error('ErrorBoundary caught an error:', error, info);
    // logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const AppWithErrorBoundary = () => {
  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>Something went wrong.</h1>
          <p>Check the console for more information.</p>
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;
