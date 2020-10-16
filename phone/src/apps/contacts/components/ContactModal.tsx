import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Nui from "../../../os/nui-events/utils/Nui";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Modal from '../../../ui/components/Modal';
import { useModal } from '../hooks/useModal';

import '../components/Contact.css'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: 5,
    marginTop: 20,
  },
  root: {
    position: "fixed",
    bottom: 380,
    zIndex: 2,
    background: "#232323",
    marginLeft: "-4em",
    height: "20%",
  },
  textInputField: {
    fontSize: 20,
    borderBottomColor: 'red'
  },
  addBtn: {
    margin: 'auto',
    width: 150,
    background: "#2196f3",
    marginBottom: 10,
    padding: 8
  },
  cancelBtn: {
    margin: 'auto',
    width: 150,
    background: "#232323",
    marginBottom: 20,
    padding: 8
  }
}));

export const AddContactModal = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const classes = useStyles();

  const { showModal, setShowModal } = useModal();

  const addContact = () => {
    if (name === "" || number === "") {
      console.log("You need to pass in values");
    } else {
      Nui.send("contacts:add", {
        name,
        number,
        avatar
      });
      console.log(name, number, avatar);
    }
  };

  const _handleClose = () => {
    setShowModal(false)
  }

  return (
    <Modal visible={showModal} handleClose={_handleClose}>
      <List style={{ marginTop: 10 }}>
        <ListItem>
          <TextField
            value={name}
            inputProps={{ className: classes.textInputField}}
            onChange={(e) => setName(e.target.value)}
            style={{ fontSize: "18px" }}
            fullWidth
            variant="outlined"
            placeholder="Name"
          />
        </ListItem>
        <ListItem>
          <TextField
            value={number}
            inputProps={{ className: classes.textInputField}}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
            placeholder="Number"
            variant="outlined"
            type="number"
          />
        </ListItem>
        <ListItem>
          <TextField
            value={avatar}
            inputProps={{ className: classes.textInputField}}
            onChange={(e) => setAvatar(e.target.value)}
            fullWidth
            placeholder="Picture link"
            variant="standard"
            type="text"
          />
        </ListItem>
        </List>
        <Button className={classes.addBtn} onClick={addContact}>Add Contact</Button>
        <Button className={classes.cancelBtn} onClick={_handleClose}>Cancel</Button>
    </Modal>
  );
};
