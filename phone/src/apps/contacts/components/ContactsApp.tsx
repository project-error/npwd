import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import { Route } from 'react-router-dom';
import ContactsInfoPage from './views/ContactInfo';
import { ContactPage } from './views/ContactsPage';
import { ContactsThemeProvider } from '../providers/ContactsThemeProvider';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { Fab, Theme } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

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
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/contacts/" exact component={ContactPage} />
            <Route path="/contacts/:id" exact component={ContactsInfoPage} />
          </React.Suspense>
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
