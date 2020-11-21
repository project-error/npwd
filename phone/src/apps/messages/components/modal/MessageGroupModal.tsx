import React, { useEffect, useState, useCallback } from "react";
import { Slide, Paper, Button } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useStyles from "./modal.styles";

import useModals from "../../hooks/useModals";
import NewMessageGroupForm from "../form/NewMessageGroupForm";

const MessageGroupModal = () => {
  const classes = useStyles();
  const { showNewMessageGroup, setShowNewMessageGroup } = useModals();

  const handleClose = () => setShowNewMessageGroup(false);

  return (
    <Slide direction="left" in={showNewMessageGroup}>
      <Paper
        className={showNewMessageGroup ? classes.modalRoot : classes.modalHide}
      >
        <Button onClick={handleClose}>
          <ArrowBackIcon fontSize="large" />
        </Button>
        <NewMessageGroupForm />
      </Paper>
    </Slide>
  );
};

export default MessageGroupModal;
