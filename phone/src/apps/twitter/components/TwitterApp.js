import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import Nui from "../../../os/nui-events/utils/Nui";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import TweetList from "./TweetList";
import AddTweetModal from "./AddTweetModal";
import { AppLoader } from "../../../ui/components/AppLoader";
import TweetButton from "./TweetButton";
import TwitterTitle from "./TwitterTitle";
import BottomNavigation from "./BottomNavigation";
import TwitterProfile from "./profile/TwitterProfile";
import { useProfile } from "../hooks/useProfile";

import "./twitter.css";

const PAGE_COMPONENT_MAPPING = {
  0: <TweetList />,
  1: <TweetList />,
  2: <TwitterProfile />,
};
const MINIMUM_LOAD_TIME = 750;

export const TwitterApp = () => {
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activePage, setActivePage] = useState(2);
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
    <AppWrapper>
      <TwitterTitle />
      <AppContent>
        <div id="twitter-content">
          <AddTweetModal visible={modalVisible} handleClose={hideModal} />
          {component}
        </div>
      </AppContent>
      {showTweetButton && <TweetButton openModal={openModal} />}
      <BottomNavigation
        activePage={activePage}
        handleChange={handlePageChange}
      />
    </AppWrapper>
  );
};
