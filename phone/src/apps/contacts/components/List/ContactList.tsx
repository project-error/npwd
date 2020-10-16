import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import { 
  Button,   
  ListItemAvatar,
  Avatar as MuiAvatar 
} from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { useFilteredContacts } from '../../hooks/useFilteredContacts';

import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";
import { List } from "../../../../ui/components/List";
import { ListItem } from "../../../../ui/components/ListItem";
import { useContacts } from "../../hooks/useContacts";

import Nui from "../../../../os/nui-events/utils/Nui";

export const ContactList = () => {

  const { filteredContacts } = useFilteredContacts();

  const contacts = useContacts();

  const startCall = (number) => {
    console.log(number);
    Nui.send("phone:startCall", {
      number,
    });
  };

  return (
    <List>
      {contacts.contacts.filter(contact => contact.display.includes(filteredContacts) || contact.number.includes(filteredContacts)).map((contact) => (
        <ListItem key={contact.id} divider>
          <ListItemAvatar>
            {contact.avatar ? (
              <MuiAvatar src={contact.avatar} />
            ): (
              <MuiAvatar>{contact.display.slice(0, 1)}</MuiAvatar>
            )}
          </ListItemAvatar>
          <ListItemText primary={contact.display} secondary={contact.number} />
          <Button onClick={() => startCall(contact.number)}>
            <PhoneIcon />
          </Button>
          <Button
            onClick={() =>
              console.log("Message: " + contact.display, contact.number)
            }
          >
            <ChatIcon />
          </Button>
          <Button>
            <FontAwesomeIcon icon={faPen} size="lg"/>
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
