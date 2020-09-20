import React, { useState, useCallback, useEffect } from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles, Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useApp } from "../../../os/apps/hooks/useApps";

import AddTweetModal from "./AddTweetModal";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: blue[600],
    alignItems: "center",
  },
  header: {
    fontFamily: "'Bebas Neue', cursive",
    textAlign: "center",
    fontSize: 50,
  },
}));

export const TwitterApp = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const { t } = useTranslation();
  const classes = useStyles();
  const twitter = useApp("TWITTER");

  const openModal = useCallback(() => setModalVisible(true), []);
  const hideModal = useCallback(() => setModalVisible(false), []);

  useEffect(() => {
    const listener = window.addEventListener(
      "keydown",
      (e) => {
        const isEscapeKey = e.key == "Escape" || e.key == "Esc";
        if (isEscapeKey) {
          e.preventDefault();
          hideModal();
        }
      },
      true
    );
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <AppWrapper>
      <AppTitle app={twitter} className={classes.root} />
      <Button
        onClick={openModal}
        variant="contained"
        style={{ backgroundColor: "#232323" }}
      >
        <AddCircleIcon color="action" />
      </Button>
      <AppContent>
        <AddTweetModal visible={modalVisible} handleClose={hideModal} />
      </AppContent>
    </AppWrapper>
  );
};
