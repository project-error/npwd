import React from 'react';
import { Button, List, ListSubheader } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { useFilteredContacts } from '../../hooks/state';
import { useCall } from '@os/call/hooks/useCall';
import { useContactActions } from '../../hooks/useContactActions';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import useMessages from '../../../messages/hooks/useMessages';
import { usePhone } from '@os/phone/hooks';
import { ContactItem } from './ContactItem';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();
  const { initializeCall } = useCall();
  const { findExistingConversation } = useContactActions();
  const myPhoneNumber = useMyPhoneNumber();
  const { goToConversation } = useMessages();
  const { ResourceConfig } = usePhone();

  const openContactInfo = (contactId: number) => {
    history.push(`/contacts/${contactId}`);
  };

  const startCall = (number: string) => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number);
  };

  const handleMessage = (phoneNumber: string) => {
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    const conversation = findExistingConversation(myPhoneNumber, phoneNumber);
    if (conversation) {
      return goToConversation(conversation);
    }

    history.push(`/messages/new?phoneNumber=${phoneNumber}`);
  };

  return (
    <>
      <SearchContacts />
      {!!ResourceConfig?.defaultContacts.length && (
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Default contacts
            </ListSubheader>
          }
        >
          {ResourceConfig?.defaultContacts?.map((contact) => (
            <ContactItem
              id={contact.id}
              avatar={contact.avatar}
              display={contact.display}
              number={contact.number}
              render={
                <>
                  <Button onClick={() => startCall(contact.number)}>
                    <PhoneIcon />
                  </Button>
                  <Button onClick={() => handleMessage(contact.number)}>
                    <ChatIcon />
                  </Button>
                </>
              }
            />
          ))}
        </List>
      )}
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Contacts
          </ListSubheader>
        }
      >
        {filteredContacts?.map((contact) => (
          <ContactItem
            id={contact.id}
            avatar={contact.avatar}
            display={contact.display}
            number={contact.number}
            render={
              <>
                <Button onClick={() => startCall(contact.number)}>
                  <PhoneIcon />
                </Button>
                <Button onClick={() => handleMessage(contact.number)}>
                  <ChatIcon />
                </Button>
                <Button style={{ margin: -15 }} onClick={() => openContactInfo(contact.id)}>
                  <MoreVertIcon />
                </Button>
              </>
            }
          />
        ))}
      </List>
    </>
  );
};
