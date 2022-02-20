import { render } from '@testing-library/react';
import { Resource } from 'i18next';
import { ReactElement, ReactNode, Suspense } from 'react';
import { HashRouter, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import { RecoilRoot } from 'recoil';
import { SoundProvider } from '@os/sound/providers/SoundProvider';
import { createTheme, ThemeProvider } from '@mui/material';
import SnackbarProvider from '@os/snackbar/providers/SnackbarProvider';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const renderWithRouter = (history: MemoryHistory) => (ui: ReactNode) => {
  return <Router history={history}>{ui}</Router>;
};

const renderWithNotifications = (ui: ReactNode) => {
  return <NotificationsProvider>{ui}</NotificationsProvider>;
};

const renderWithRecoil = (ui: ReactNode) => {
  return <RecoilRoot>{ui}</RecoilRoot>;
};

const renderWithSound = (ui: ReactNode) => {
  return <SoundProvider>{ui}</SoundProvider>;
};

const renderWithTheme = (ui: ReactNode) => {
  return <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
};

const renderWithSuspense = (ui: ReactNode) => {
  return <Suspense fallback={<div>loading..</div>}>{ui}</Suspense>;
};

const renderWithSnackbar = (ui: ReactNode) => {
  return <SnackbarProvider>{ui}</SnackbarProvider>;
};

type RenderWithProvidersOptions = {
  resources?: Resource;
  router?: Partial<HashRouter>;
  history?: MemoryHistory;
};
export const renderWithProviders = (ui: ReactElement, options?: RenderWithProvidersOptions) => {
  const history = options?.history ?? createMemoryHistory();

  /* From bottom, to top. Lowest = rendered furthest out. */
  const providers = [
    renderWithRouter(history),
    renderWithSnackbar,
    renderWithNotifications,
    renderWithSuspense,
    renderWithSound,
    renderWithRecoil,
    renderWithTheme,
  ];

  const renderedElement = providers.reduce((prevUi, provider) => {
    return provider(prevUi);
  }, ui);

  return render(renderedElement);
};
