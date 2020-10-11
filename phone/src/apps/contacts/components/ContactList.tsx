import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";

import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteIcon from "@material-ui/icons/Delete";
import { List } from "../../../ui/components/List";
import { ListItem } from "../../../ui/components/ListItem";
import { useContacts } from "../hooks/useContacts";

import Nui from "../../../os/nui-events/utils/Nui";

export const ContactList = () => {
  const contacts = useContacts();

  const startCall = (number) => {
    console.log(number);
    Nui.send("phone:startCall", {
      number,
    });
  };

  return (
    <List>
      {contacts.contacts.map((contact) => (
        <ListItem key={contact.id} divider>
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
            <DeleteIcon />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
