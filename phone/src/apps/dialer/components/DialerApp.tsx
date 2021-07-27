import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { DialerHistory } from './views/DialerHistory';
import { useApp } from '../../../os/apps/hooks/useApps';
import { Switch, Route } from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { useDialHistory } from '../hooks/useDialHistory';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { ContactList } from '../../contacts/components/List/ContactList';
import { DialerThemeProvider } from '../providers/DialerThemeProvider';
import { CallEvents } from '../../../../../typings/call';
import { Box, CircularProgress } from '@material-ui/core';

const LoadingSpinner: React.FC = () => (
  <Box>
    <CircularProgress />
  </Box>
);

export const DialerApp = () => {
  const dialer = useApp('DIALER');
  return (
    <DialerThemeProvider>
      <AppWrapper>
        <AppTitle app={dialer} />
        <AppContent>
          <Switch>
            <Route path="/phone/dial">
              <DialPage />
            </Route>
            <Route exact path="/phone">
              <React.Suspense fallback={<LoadingSpinner />}>
                <DialerHistory />
              </React.Suspense>
            </Route>
            <Route path="/phone/contacts" component={ContactList} />
          </Switch>
        </AppContent>
        <DialerNavBar />
      </AppWrapper>
    </DialerThemeProvider>
  );
};
