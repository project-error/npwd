import './messages.css';
import React, { useEffect } from 'react';
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
import Nui from '../../../os/nui-events/utils/Nui';

export const MessagesApp = () => {
  const messages = useApp('MESSAGES');
  const history = useHistory();

  useEffect(() => {
    Nui.send('phone:fetchMessageGroups');
  }, []);

  return (
    <AppWrapper id='messages-app'>
      <AppTitle app={messages} />
      <AppContent>
        <Switch>
          <Route
            path='/messages/conversations/:groupId'
            component={MessageModal}
          />
          <Route
            exact
            path='/messages'
            render={() => (
              <>
                <MessagesList />
              </>
            )}
          />
        </Switch>
        <Switch>
          <Route
            exact
            path={['/messages/new/:phoneNumber', '/messages/new']}
            render={() => <MessageGroupModal />}
          />
        </Switch>
      </AppContent>
      <NewMessageGroupButton
        onClick={() => history.push('/messages/new')}
      />
      <AlertBar />
    </AppWrapper>
  );
};

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
      {
        id: 1,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        isRead: true,
        isMine: true,
        updatedAt: Date.now(),
      },
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
      {
        id: 1,
        message: 'sup!',
        user_identifier: '1234',
        phone_number: '444-4444',
        display: 'kidz',
        avatar: null,
        isRead: true,
        isMine: true,
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
