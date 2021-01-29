import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { DialerHistory } from './views/DialerHistory';
import { useApp } from '../../../os/apps/hooks/useApps';
import { Switch, Route } from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { useDailHistory } from '../hooks/useDailHistory';

export const DialerApp = () => {

  const history = useDailHistory()

  const dialer = useApp('DIALER');
  return (
    <AppWrapper>
      <AppTitle app={dialer} />
      <AppContent>
        <Switch>
          <Route path='/phone/dial'>
            <DialPage />
          </Route>
          <Route path='/phone'>
            <DialerHistory calls={history} />
          </Route>
          {/*<Route path='/phone/contacts'></Route>*/}
        </Switch>
      </AppContent>
      <DialerNavBar />
    </AppWrapper>
  );
};
