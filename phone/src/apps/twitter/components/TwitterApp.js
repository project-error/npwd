import React, { useState, useCallback } from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles, Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { useApp } from "../../../os/apps/hooks/useApps";

import TweetList from "./TweetList";
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
  const [modalVisible, setModalVisible] = useState(false);
  const classes = useStyles();
  const twitter = useApp("TWITTER");

  const openModal = useCallback(() => setModalVisible(true), []);
  const hideModal = useCallback(() => setModalVisible(false), []);

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
        <TweetList />
      </AppContent>
    </AppWrapper>
  );
};
