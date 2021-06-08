import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, ListItemAvatar, Avatar as MuiAvatar, List, ListItem } from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { CallEvents } from '../../../../../../typings/call';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useFilteredContacts } from '../../hooks/state';

export const ContactList = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();
  const Nui = useNuiRequest();

  const openContactInfo = (contactId: number) => {
    history.push(`/contacts/${contactId}`);
  };

  const startCall = (number: string) => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    Nui.send(CallEvents.INITIALIZE_CALL, {
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

  return (
    <>
      <SearchContacts />
      <List>
        {filteredContacts.map((contact) => (
          <ListItem key={contact.id} divider>
            <ListItemAvatar>
              {contact.avatar ? (
                <MuiAvatar src={contact.avatar} />
              ) : (
                <MuiAvatar>{contact.display.slice(0, 1).toUpperCase()}</MuiAvatar>
              )}
            </ListItemAvatar>
            <ListItemText primary={contact.display} secondary={contact.number} />
            <Button onClick={() => startCall(contact.number)}>
              <PhoneIcon />
            </Button>
            <Button onClick={() => handleMessage(contact.number)}>
              <ChatIcon />
            </Button>
            <Button style={{ margin: -15 }} onClick={() => openContactInfo(contact.id)}>
              <MoreVertIcon />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
