import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { ContactList } from "./ContactList";
import { useApp } from "../../../os/apps/hooks/useApps";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AddContactModal } from "./ContactModal";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalOpener: {
    backgroundColor: "red",
    height: 50,
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export const ContactsApp = () => {
  const [modal, setModal] = useState(false);
  const classes = useStyles();
  const contacts = useApp("CONTACTS");

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <AppWrapper>
      <AppTitle app={contacts}></AppTitle>
      <Button
        onClick={openModal}
        variant="contained"
        style={{ backgroundColor: "#232323" }}
      >
        <AddCircleIcon color="action" />
      </Button>
      <AppContent>
        <AddContactModal show={modal} handleClose={closeModal} />
        <ContactList />
      </AppContent>
    </AppWrapper>
  );
};
