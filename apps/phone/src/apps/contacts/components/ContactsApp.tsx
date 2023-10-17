import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { Route } from 'react-router-dom';
import ContactsInfoPage from './views/ContactInfo';
import { ContactPage } from './views/ContactsPage';
import { ContactsThemeProvider } from '../providers/ContactsThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const ContactsApp: React.FC = () => {
  return (
    <ContactsThemeProvider>
      <AppWrapper id="contact-app">
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/contacts/" exact component={ContactPage} />
            <Route path="/contacts/:id" exact component={ContactsInfoPage} />
          </React.Suspense>
        </AppContent>
      </AppWrapper>
    </ContactsThemeProvider>
  );
};
