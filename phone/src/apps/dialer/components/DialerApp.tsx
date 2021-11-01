import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { DialerHistory } from './views/DialerHistory';
import { useApp } from '../../../os/apps/hooks/useApps';
import { Switch, Route } from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { ContactList } from '../../contacts/components/List/ContactList';
import { DialerThemeProvider } from '../providers/DialerThemeProvider';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';

export const DialerApp: React.FC = () => {
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
