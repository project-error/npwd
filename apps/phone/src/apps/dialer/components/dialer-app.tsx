import React from 'react';
import { Route, Routes } from 'react-router';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { DialerHistory } from './views/DialerHistory';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { ContactList } from '../../contacts/components/List/ContactList';
import { DialerThemeProvider } from '../providers/DialerThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import InjectDebugData from '@os/debug/InjectDebugData';

export const DialerApp: React.FC = () => {
  return (
    <DialerThemeProvider>
      <AppWrapper>
        <AppContent>
          <Routes>
            <Route path="/phone/dial" element={<DialPage />} />
            <Route
              path="/phone"
              element={
                <React.Suspense fallback={<LoadingSpinner />}>
                  <DialerHistory />
                </React.Suspense>
              }
            />
            <Route
              path="/phone/contacts"
              element={
                <React.Suspense fallback={<LoadingSpinner />}>
                  <ContactList />
                </React.Suspense>
              }
            />
          </Routes>
        </AppContent>
        <DialerNavBar />
      </AppWrapper>
    </DialerThemeProvider>
  );
};
