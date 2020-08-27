import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";

import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";
import { List } from "../../../ui/components/List";
import { ListItem } from "../../../ui/components/ListItem";
import { useContacts } from "../hooks/useContacts";

export const ContactList = () => {
  const contacts = useContacts();
  return (
    <List>
      {contacts.contacts.map((contact) => (
        <ListItem key={contact.id} divider>
          <ListItemText primary={contact.display} secondary={contact.number} />
          <Button>
            <PhoneIcon />
          </Button>
          <Button>
            <ChatIcon />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
