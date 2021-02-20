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

export const ContactsApp = () => {
  const contacts = useApp('CONTACTS');

  return (
    <ContactsThemeProvider>
      <AppWrapper id='contact-app'>
        <AppTitle app={contacts} />
        <AppContent>
          <Route path='/contacts/' exact component={ContactPage} />
          <Route path='/contacts/:id' exact component={ContactsInfoPage} />
        </AppContent>
      </AppWrapper>
    </ContactsThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'CONTACTS',
    method: 'setContacts',
    data: [
      {
        id: 1,
        display: 'Ruqen',
        number: '555-15196',
      },
      {
        id: 2,
        display: 'Taso',
        number: '215-8139',
        avatar: 'http://i.tasoagc.dev/i9Ig',
      },
      {
        id: 3,
        display: 'Chip',
        number: '417-8792',
      },
    ],
  },
]);
