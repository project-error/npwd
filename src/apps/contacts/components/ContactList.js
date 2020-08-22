import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";

import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    color: "#fff",
  },
  listItem: {
    color: "#fff",
  },
}));

export const ContactList = ({ contacts, onCall, onMessage }) => {
  const classes = useStyles();
  return (
    <List component="nav" className={classes.root}>
      {contacts.map((contact) => (
        <ListItem divider className={classes.listItem}>
          <ListItemText
            primary={contact.display}
            secondary={contact.phoneNumber}
          />
          <Button className={classes.listItem} onClick={onCall}>
            <PhoneIcon />
          </Button>
          <Button className={classes.listItem} onClick={onMessage}>
            <ChatIcon />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
