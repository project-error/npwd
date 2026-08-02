import React from 'react';
import { Route, Routes } from 'react-router';
import { AppWrapper } from '@ui/components';
import ContactsInfoPage from './views/ContactInfo';
import { ContactPage } from './views/ContactsPage';
import { ContactsThemeProvider } from '../providers/ContactsThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const ContactsApp: React.FC = () => {
  return (
    <ContactsThemeProvider>
      <AppWrapper id="contact-app">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-keyos-night text-keyos-cream">
          <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route index element={<ContactPage />} />
              <Route path=":id" element={<ContactsInfoPage />} />
            </Routes>
          </React.Suspense>
        </div>
      </AppWrapper>
    </ContactsThemeProvider>
  );
};
