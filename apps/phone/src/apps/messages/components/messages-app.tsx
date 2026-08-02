import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { MessageModal } from './modal/MessageModal';
import NewMessageGroupButton from './form/NewMessageGroupButton';
import { MessagesThemeProvider } from '../providers/MessagesThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';

export const MessagesApp = () => {
  const messages = useApp('MESSAGES');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <MessagesThemeProvider>
      <AppWrapper id="messages-app">
        <WordFilterProvider>
          {pathname === '/messages' && <AppTitle app={messages} />}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-keyos-night text-keyos-cream">
            <React.Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route index element={<MessagesList />} />
                <Route path="conversations/:groupId" element={<MessageModal />} />
                <Route path="new/:phoneNumber" element={<MessageGroupModal />} />
                <Route path="new" element={<MessageGroupModal />} />
              </Routes>
            </React.Suspense>
          </div>
          {pathname === '/messages' && (
            <NewMessageGroupButton onClick={() => navigate('/messages/new')} />
          )}
        </WordFilterProvider>
      </AppWrapper>
    </MessagesThemeProvider>
  );
};
