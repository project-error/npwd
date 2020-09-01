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
          <Button
            onClick={() =>
              console.log("Call: " + contact.display, contact.number)
            }
          >
            <PhoneIcon />
          </Button>
          <Button
            onClick={() =>
              console.log("Message: " + contact.display, contact.number)
            }
          >
            <ChatIcon />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
