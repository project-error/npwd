import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MessageModal } from './modal/MessageModal';
import NewMessageGroupButton from './form/NewMessageGroupButton';
import { MessagesThemeProvider } from '../providers/MessagesThemeProvider';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';

export const MessagesApp = () => {
  const messages = useApp('MESSAGES');
  const history = useHistory();

  return (
    <MessagesThemeProvider>
      <AppWrapper id="messages-app">
        <AppTitle app={messages} />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Switch>
              <Route path="/messages/conversations/:groupId">
                <div>
                  <MessageModal />
                </div>
              </Route>
              <Route exact path="/messages">
                <MessagesList />
              </Route>
            </Switch>
            <Switch>
              <Route exact path={['/messages/new/:phoneNumber', '/messages/new']}>
                <MessageGroupModal />
              </Route>
            </Switch>
          </React.Suspense>
        </AppContent>
        <Route exact path="/messages">
          <NewMessageGroupButton onClick={() => history.push('/messages/new')} />
        </Route>
      </AppWrapper>
    </MessagesThemeProvider>
  );
};
