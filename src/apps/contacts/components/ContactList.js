import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";

import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";

export const ContactList = ({ contacts, onCall, onMessage }) => {
  return (
    <List>
      {contacts.map((contact) => (
        <ListItem key={contact.id} divider>
          <ListItemText
            primary={contact.display}
            secondary={contact.phoneNumber}
          />
          <Button onClick={() => onCall(contact.display)}>
            <PhoneIcon />
          </Button>
          <Button onClick={onMessage}>
            <ChatIcon />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
