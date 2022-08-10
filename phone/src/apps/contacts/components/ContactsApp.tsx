import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { Route } from 'react-router-dom';
import ContactsInfoPage from './views/ContactInfo';
import { ContactPage } from './views/ContactsPage';
import { ContactsThemeProvider } from '../providers/ContactsThemeProvider';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Fab from '@mui/material/Fab';
import { useHistory, useLocation } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const useStyles = makeStyles((theme: Theme) => ({
  absolute: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(2),
  },
}));

export const ContactsApp: React.FC = () => {
  const contacts = useApp('CONTACTS');
  const history = useHistory();
  const classes = useStyles();
  const { pathname } = useLocation();

  const pathTemplate = /contacts\/-?\d/;

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
        {!pathname.match(pathTemplate) && (
          <Fab
            color="primary"
            onClick={() => history.push('/contacts/-1')}
            className={classes.absolute}
          >
            <PersonAddIcon />
          </Fab>
        )}
      </AppWrapper>
    </ContactsThemeProvider>
  );
};
