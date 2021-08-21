import React, { useEffect } from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MessageModal } from './modal/MessageModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import NewMessageGroupButton from './form/NewMessageGroupButton';
import { MessagesThemeProvider } from '../providers/MessagesThemeProvider';
import { MessageEvents } from '../../../../../typings/messages';
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

/* InjectDebugData([
  {
    app: 'MESSAGES',
    method: MessageEvents.FETCH_MESSAGE_GROUPS_SUCCESS,
    data: [
      {
        groupId: '2',
        groupDisplay: 'dev-chat',
        isGroupChat: true,
        phoneNumbers: ['444-4444', '111-1134', '111-1111'],
        avatar: null,
        label: null,
        updatedAt: Date.now(),
        unreadCount: 2,
      },
      {
        groupId: '3',
        groupDisplay: 'Chip',
        isGroupChat: false,
        phoneNumbers: ['111-1134', '111-1111'],
        avatar: null,
        label: null,
        updatedAt: Date.now(),
        unreadCount: 0,
      },
      {
        groupId: '4',
        groupDisplay: 'Dick',
        isGroupChat: false,
        phoneNumbers: ['111-1134', '111-2342'],
        avatar: null,
        label: null,
        updatedAt: Date.now(),
        unreadCount: 0,
      },
    ],
  },
]); */

InjectDebugData(
  [
    {
      app: 'MESSAGES',
      method: MessageEvents.FETCH_MESSAGES_SUCCESS,
      data: [
        {
          id: 1,
          message: 'sup!',
          user_identifier: '1234',
          phone_number: '444-4444',
          display: 'kidz',
          avatar: null,
          groupId: '2',
          isRead: true,
          isMine: false,
          updatedAt: Date.now(),
        },
        {
          id: 2,
          message: 'sup!',
          user_identifier: '1234',
          phone_number: '444-4444',
          display: 'kidz',
          avatar: null,
          groupId: '2',
          isRead: true,
          isMine: true,
          updatedAt: Date.now(),
        },
        {
          id: 3,
          message: 'sup!',
          user_identifier: '123',
          phone_number: '444-4444',
          display: 'kidz',
          avatar: null,
          groupId: '2',
          isRead: true,
          isMine: false,
          updatedAt: Date.now(),
        },
        {
          id: 4,
          message:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Hadena_albimacula.jpg/800px-Hadena_albimacula.jpg',
          user_identifier: '123',
          phone_number: '444-4444',
          display: 'kidz',
          avatar: null,
          groupId: '2',
          isRead: true,
          isMine: false,
          updatedAt: Date.now(),
        },
      ],
    },
    {
      app: 'MESSAGES',
      method: 'createMessagesBroadcast',
      data: {
        groupId: '2',
        number: '777-7777',
        message: 'Hi! Just checking in on you!',
      },
    },
    {
      app: 'MESSAGES',
      method: 'createMessagesBroadcast',
      data: {
        groupId: '2',
        number: 'Kidz',
        message: 'Hi! You are awesome!',
      },
    },
    {
      app: 'MESSAGES',
      method: 'createMessagesBroadcast',
      data: {
        groupId: '3',
        number: 'Kidz',
        message: 'I am testing this like crazy',
      },
    },
  ],
  3000,
);
