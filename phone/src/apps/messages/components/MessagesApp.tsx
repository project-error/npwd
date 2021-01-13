import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import AlertBar from './AlertBar';
import { MessageModal } from './modal/MessageModal';
import MessageGroupModal from './modal/MessageGroupModal';
import NewMessageGroupButton from './buttons/NewMessageGroupButton';
import MessagesList from './list/MessagesList';
import './messages.css';

export const MessagesApp = () => {
  const messages = useApp('MESSAGES');
  return (
    <AppWrapper id='messages-app'>
      <AppTitle app={messages} />
      <MessageModal />
      <MessageGroupModal />
      <AppContent>
        <MessagesList />
        <NewMessageGroupButton />
      </AppContent>
      <AlertBar />
    </AppWrapper>
  );
};
