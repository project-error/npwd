import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Paper } from "@material-ui/core";
import Nui from "../../../os/nui-events/utils/Nui";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles((theme) => ({
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

  displayBlock: {
    /*Sets modal to center*/
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  displayNone: {
    display: "none",
  },
}));

export const AddContactModal = ({ handleClose, show, children }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const classes = useStyles();
  const showHideClassName = show ? classes.displayBlock : classes.displayNone;

  const addContact = () => {
    if (name === "" || number === "") {
      console.log("You need to pass in values");
    } else {
      Nui.send("contacts:add", {
        name,
        number,
      });
      console.log(name, number);
    }
  };

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <List>
          <ListItem>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: "18px" }}
              fullWidth
              placeholder="Name"
            />
          </ListItem>
          <ListItem>
            <TextField
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              fullWidth
              placeholder="Number"
              type="number"
            />
          </ListItem>
        </List>
        <Button onClick={addContact}>Add</Button>
        <Button onClick={handleClose}>Close</Button>
      </Paper>
    </div>
  );
};
