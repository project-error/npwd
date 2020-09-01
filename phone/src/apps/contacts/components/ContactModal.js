import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AppContent } from "../../../ui/components/AppContent";
import { Container, Button } from "@material-ui/core";
import Nui from "../../../os/nui-events/utils/Nui";
import { TextInput } from "../../../ui/components/Input";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalContainer: {
    backgroundColor: "#232323",
    width: "80%",
    height: "30vh",
  },
  button: {
    margin: 5,
    marginTop: 20,
  },
}));

export const AddContactModal = () => {
  const [modal, setModal] = useState(false);

  const Modal = (props) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");

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
    const classes = useStyles();
    return (
      <Container
        fixed
        className={classes.modalContainer}
        style={{
          visibility: props.show ? "visible" : "hidden",
        }}
      >
        <h2 style={{ textAlign: "center" }}>New contact:</h2>
        <TextInput
          style={{ display: "flex" }}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          style={{ display: "flex" }}
          placeholder="Phone number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          id="number-basic"
          type="number"
          label="Phone Number"
          color="primary"
        />
        <Button
          onClick={addContact}
          variant="contained"
          style={{ backgroundColor: "#fff", color: "#000" }}
          className={classes.button}
        >
          Add
        </Button>
        <Button
          onClick={() => setModal(false)}
          variant="contained"
          style={{ backgroundColor: "#c0392b", color: "#fff" }}
          className={classes.button}
        >
          Cancel
        </Button>
      </Container>
    );
  };

  return (
    <AppContent>
      <Button fullWidth onClick={() => setModal(true)}>
        <AddCircleIcon />
      </Button>
      <Modal show={modal} />
    </AppContent>
  );
};
