import './messages.css';
import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import AlertBar from './AlertBar';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MessageModal } from './modal/MessageModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import NewMessageGroupButton from './buttons/NewMessageGroupButton';

InjectDebugData([
  {
    app: 'MESSAGES',
    method: 'phone:fetchMessagesSuccess',
    data: [
      {
        id: 1,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        isRead: true,
        isMine: false,
        updatedAt: Date.now(),
      },
    ],
  },
  {
    app: 'MESSAGES',
    method: 'phone:fetchMessageGroupsSuccess',
    data: [
      {
        groupId: '2',
        groupDisplay: 'dev-chat',
        isGroupChat: true,
        avatar: null,
        label: null,
        updatedAt: Date.now(),
      },
    ],
  },
]);

export const MessagesApp = () => {
  const messages = useApp('MESSAGES');
  const history = useHistory();
  return (
    <AppWrapper id='messages-app'>
      <AppTitle app={messages} />
      <AppContent>
        <Switch>
          <Route
            exact
            path='/messages/conversations/:groupId'
            component={MessageModal}
          />
        </Switch>
        <Switch>
          <Route
            path='/messages'
            render={() => (
              <>
                <MessagesList />
                <NewMessageGroupButton
                  onClick={() => history.push('/messages/new')}
                />
              </>
            )}
          />
          <Route exact path='/messages/new' component={MessageGroupModal} />
        </Switch>
      </AppContent>
      <AlertBar />
    </AppWrapper>
  );
};
