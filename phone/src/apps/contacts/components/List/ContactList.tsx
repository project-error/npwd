import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Button,
  ListItemAvatar,
  Avatar as MuiAvatar,
  List,
  ListItem,
  makeStyles,
} from '@material-ui/core';

import { useFilteredContacts } from '../../hooks/useFilteredContacts';

import PhoneIcon from '@material-ui/icons/Phone';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useContacts } from '../../hooks/useContacts';
import { useContactModal } from '../../hooks/useContactModal';
import { useContactDetail } from '../../hooks/useContactDetail';

import Nui from '../../../../os/nui-events/utils/Nui';

import '../Contact.css';

const useStyles = makeStyles((theme) => ({
  updateButton: {
    margin: 'auto',
    fontSize: 14,
    width: 150,
    background: '#2196f3',
    marginBottom: 10,
    padding: 8,
  },
  collapseItem: {
    margin: 'auto',
    width: '50%',
  },
}));

export const ContactList = () => {
  const { filteredContacts } = useFilteredContacts();
  const { setShowContactModal } = useContactModal();
  const { contactDetail, setContactDetail } = useContactDetail();

  const contacts = useContacts();

  const openContactInfo = (contact) => {
    setShowContactModal(true);
    setContactDetail(contact);
    console.log('CONTACT', contactDetail);
  };
  const startCall = (number) => {
    console.log(number);
    Nui.send('phone:startCall', {
      number,
    });
  };

  return (
    <List>
      {contacts.contacts
        .filter(
          (contact) =>
            contact.display.includes(filteredContacts.toLowerCase()) ||
            contact.number.includes(filteredContacts.toLowerCase())
        )
        .map((contact) => (
          <>
            <ListItem key={contact.id} divider>
              <ListItemAvatar>
                {contact.avatar ? (
                  <MuiAvatar src={contact.avatar} />
                ) : (
                  <MuiAvatar>
                    {contact.display.slice(0, 1).toUpperCase()}
                  </MuiAvatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={contact.display}
                secondary={contact.number}
              />
              <Button onClick={() => startCall(contact.number)}>
                <PhoneIcon />
              </Button>
              <Button
                onClick={() =>
                  console.log('Message: ' + contact.display, contact.number)
                }
              >
                <ChatIcon />
              </Button>
              <Button
                style={{ margin: -15 }}
                onClick={() => openContactInfo(contact)}
              >
                <MoreVertIcon />
              </Button>
            </ListItem>
          </>
        ))}
    </List>
  );
};
