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
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Fab from '@material-ui/core/Fab';
import { useHistory } from 'react-router';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  absolute: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(2),
  },
}));

export const ContactsApp = () => {
  const contacts = useApp('CONTACTS');
  const history = useHistory();
  const classes = useStyles();

  return (
    <ContactsThemeProvider>
      <AppWrapper id="contact-app">
        <AppTitle app={contacts} />
        <AppContent>
          <Route path="/contacts/" exact component={ContactPage} />
          <Route path="/contacts/:id" exact component={ContactsInfoPage} />
        </AppContent>
        <Fab
          color="primary"
          onClick={() => history.push('/contacts/-1')}
          className={classes.absolute}
        >
          <PersonAddIcon />
        </Fab>
      </AppWrapper>
    </ContactsThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'CONTACTS',
    method: ContactEvents.SEND_CONTACTS,
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
        number: '603-275-8373',
        avatar: 'http://i.tasoagc.dev/2QYV',
      },
      {
        id: 4,
        display: 'Kidz',
        number: '444-4444',
      },
    ],
  },
]);
