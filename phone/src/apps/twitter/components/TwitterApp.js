import React, { useState, useCallback, useEffect } from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles, Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import Nui from "../../../os/nui-events/utils/Nui";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { AppLoader } from "../../../ui/components/AppLoader";
import { useApp } from "../../../os/apps/hooks/useApps";
import { useProfile } from "../hooks/useProfile";
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

const MINIMUM_LOAD_TIME = 750;

export const TwitterApp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);
  const classes = useStyles();
  const twitter = useApp("TWITTER");
  const { profile } = useProfile();

  useEffect(() => {
    Nui.send("phone:getOrCreateTwitterProfile", {});
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMimimumLoadPassed(true);
    }, MINIMUM_LOAD_TIME);
    return () => window.clearTimeout(timeout);
  });

  const openModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // we add a minimum (but short) load time here so that
  // there isn't a quick flash of loading and immediately
  // another flash to the tweets screen.
  const hasLoaded = profile && minimumLoadPassed;

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
        {hasLoaded ? (
          <>
            <AddTweetModal visible={modalVisible} handleClose={hideModal} />
            <TweetList />
          </>
        ) : (
          <AppLoader />
        )}
      </AppContent>
    </AppWrapper>
  );
};
