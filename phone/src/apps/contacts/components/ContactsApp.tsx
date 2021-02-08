import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { ContactList } from './List/ContactList';
import { useApp } from '../../../os/apps/hooks/useApps';
import { AddContactModal } from './ContactModal';
import { useModal } from '../hooks/useModal';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Fab from '@material-ui/core/Fab';
import { InfoModal } from './modal/InfoModal';
import { useContactDetail } from '../hooks/useContactDetail';
import { ContactAlert } from './alert/ContactAlert';

import useStyles from './styles.contacts';
import InjectDebugData from '../../../os/debug/InjectDebugData';

InjectDebugData([
  {
    app: 'CONTACTS',
    method: 'setContacts',
    data: [
      {
        id: 1,
        display: 'Ruqen',
        number: '43534444',
      },
      {
        id: 1,
        display: 'Taso',
        number: '456466',
      },
    ],
  },
]);

export const ContactsApp = () => {
  const classes = useStyles();
  const { showModal, setShowModal } = useModal();
  const contacts = useApp('CONTACTS');
  const { contactDetail } = useContactDetail();

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <AppWrapper id='contact-app'>
      <AppTitle app={contacts} />
      <AddContactModal />
      <InfoModal key={contactDetail?.id} />
      <div className={showModal ? classes.backgroundModal : undefined} />
      <AppContent>
        <ContactList />
        <Fab
          onClick={openModal}
          style={{ backgroundColor: '#2196f3', color: '#fff' }}
          className={classes.absolute}
        >
          <PersonAddIcon />
        </Fab>
        <ContactAlert />
      </AppContent>
    </AppWrapper>
  );
};
