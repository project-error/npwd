import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Nui from "../../../os/nui-events/utils/Nui";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import TweetListContainer from "./TweetListContainer";
import AddTweetModal from "./AddTweetModal";
import { AppLoader } from "../../../ui/components/AppLoader";
import { useModal } from "../hooks/useModal";
import { useProfile } from "../hooks/useProfile";
import TweetButton from "./TweetButton";
import TwitterTitle from "./TwitterTitle";
import BottomNavigation from "./BottomNavigation";
import TwitterProfile from "./profile/TwitterProfile";
import AlertBar from "./alerts/AlertBar";

import "./twitter.css";
import "emoji-mart/css/emoji-mart.css";

const useStyles = makeStyles((theme) => ({
  backgroundModal: {
    background: "black",
    opacity: "0.6",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

// TODO move this to the router so the application back button works
const PAGE_COMPONENT_MAPPING = {
  0: <TweetListContainer />,
  1: <TweetListContainer />,
  2: <TwitterProfile />,
};
const MINIMUM_LOAD_TIME = 750;

export const TwitterApp = () => {
  const classes = useStyles();
  const { modalVisible, setModalVisible } = useModal();
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);
  const [activePage, setActivePage] = useState(0);
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
  const handlePageChange = (e, page) => setActivePage(page);

  // we add a minimum (but short) load time here so that
  // there isn't a quick flash of loading and immediately
  // another flash to the tweets screen.
  const hasLoaded = profile && minimumLoadPassed;
  const showTweetButton = hasLoaded && activePage === 0;
  const component = hasLoaded ? (
    PAGE_COMPONENT_MAPPING[activePage]
  ) : (
    <AppLoader />
  );

  return (
    <AppWrapper id="twitter-app">
      <AddTweetModal />
      <div className={modalVisible ? classes.backgroundModal : null} />
      <TwitterTitle />
      <AppContent>{component}</AppContent>
      {showTweetButton && <TweetButton openModal={openModal} />}
      <AlertBar />
      <BottomNavigation
        activePage={activePage}
        handleChange={handlePageChange}
      />
    </AppWrapper>
  );
};
