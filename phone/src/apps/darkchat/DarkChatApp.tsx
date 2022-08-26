import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { DarkChatThemeProvider } from './providers/DarkChatThemeProvider';
import { useApp } from '@os/apps/hooks/useApps';
import { AppTitle } from '@ui/components/AppTitle';
import { Route, Switch, useLocation } from 'react-router-dom';
import ChatList from './components/views/ChatListView';
import { ConversationView } from './components/views/ConversationView';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import DarkChatHeader from './components/ui/DarkChatHeader';

const DarkChatApp = () => {
  const darkchatApp = useApp('DARKCHAT');
  const { pathname } = useLocation();

  return (
    <DarkChatThemeProvider>
      <AppWrapper>
        {pathname === '/darkchat' ? <AppTitle app={darkchatApp} /> : <DarkChatHeader />}
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Switch>
              <Route exact path="/darkchat" component={ChatList} />
              <Route path="/darkchat/conversation/:id" component={ConversationView} />
            </Switch>
          </React.Suspense>
        </AppContent>
      </AppWrapper>
    </DarkChatThemeProvider>
  );
};

export default DarkChatApp;
