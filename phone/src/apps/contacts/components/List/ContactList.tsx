import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Button,
  ListItemAvatar,
  Avatar as MuiAvatar,
  List,
  ListItem,
} from '@material-ui/core';

import { useFilteredContacts } from '../../hooks/useFilteredContacts';

import PhoneIcon from '@material-ui/icons/Phone';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useContacts } from '../../hooks/useContacts';

import Nui from '../../../../os/nui-events/utils/Nui';

import '../Contact.css';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';

export const ContactList = () => {
  const { filteredContacts } = useFilteredContacts();
  const history = useHistory();

  const { contacts } = useContacts();

  const openContactInfo = (contactId: number) => {
    history.push(`/contacts/${contactId}`);
  };

  const startCall = (number: string) => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    Nui.send('phone:beginCall', {
      number,
    });
  };

  const handleMessage = (phoneNumber: string) => {
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    history.push(`/messages/new/${phoneNumber}`);
  };

  const filteredRegEx = new RegExp(filteredContacts, 'gi');

  return (
    <>
      <SearchContacts />
      <List>
        {contacts
          .filter(
            (contact) =>
              contact.display.match(filteredRegEx) ||
              contact.number.match(filteredRegEx)
          )
          .map((contact) => (
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
              <Button onClick={() => handleMessage(contact.number)}>
                <ChatIcon />
              </Button>
              <Button
                style={{ margin: -15 }}
                onClick={() => openContactInfo(contact.id)}
              >
                <MoreVertIcon />
              </Button>
            </ListItem>
          ))}
      </List>
    </>
  );
};
