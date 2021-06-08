import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { Route } from 'react-router-dom';
import ContactsInfoPage from './views/ContactInfo';
import { ContactPage } from './views/ContactsPage';
import { ContactsThemeProvider } from '../providers/ContactsThemeProvider';
import { ContactEvents } from '../../../../../typings/contact';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';

export const ContactsApp = () => {
  const contacts = useApp('CONTACTS');

  return (
    <ContactsThemeProvider>
      <AppWrapper id="contact-app">
        <AppTitle app={contacts} />
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
