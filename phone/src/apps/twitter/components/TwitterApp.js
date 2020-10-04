import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Nui from "../../../os/nui-events/utils/Nui";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import TweetListContainer from "./tweet/TweetListContainer";
import AddTweetModal from "./AddTweetModal";
import { useModal } from "../hooks/useModal";
import TweetButton from "./buttons/TweetButton";
import TwitterTitle from "./TwitterTitle";
import BottomNavigation from "./BottomNavigation";
import TwitterProfile from "./profile/Profile";
import AlertBar from "./alerts/AlertBar";
import TwitterSearch from "./TwitterSearch";

import "./twitter.css";
import "emoji-mart/css/emoji-mart.css";
import { useProfile } from "../hooks/useProfile";
import ProfilePrompt from "./profile/ProfilePrompt";

const useStyles = makeStyles(() => ({
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

const TWEETS_REFRESH_RATE = 15000; // TODO move this to twitter config

export const TwitterApp = () => {
  const classes = useStyles();
  const { modalVisible, setModalVisible } = useModal();
  const [activePage, setActivePage] = useState(0);
  const { profile } = useProfile();

  console.log(profile);

  useEffect(() => {
    Nui.send("phone:getOrCreateTwitterProfile", {});
    Nui.send("phone:fetchTweets", {});

    // this is a polling implementation. It is possible that
    // there is some interaction where, on a new tweet, all
    // clients are sent the updated query data. Until that can
    // be accomplished this is naive but robust.
    //
    // TODO don't call fetchTweets - implement a function that only
    // returns tweets that we don't already have
    const timeout = window.setTimeout(() => {
      Nui.send("phone:fetchTweets", {});
    }, TWEETS_REFRESH_RATE);
    return () => window.clearTimeout(timeout);
  }, []);

  // before any other action can be taken by the user we force
  // them have a profile name
  const promptProfileName =
    profile && (!profile.profile_name || !profile.profile_name.trim());

  const openModal = () => setModalVisible(true);
  const handlePageChange = (e, page) => setActivePage(page);
  const showTweetButton = !promptProfileName && activePage === 0;

  return (
    <AppWrapper id="twitter-app">
      <AddTweetModal />
      <div className={modalVisible ? classes.backgroundModal : null} />
      <TwitterTitle />
      <AppContent>
        {promptProfileName ? (
          <ProfilePrompt />
        ) : (
          <Switch>
            <Route path="/twitter" exact component={TweetListContainer} />
            <Route path="/twitter/search" component={TwitterSearch} />
            <Route path="/twitter/profile" component={TwitterProfile} />
          </Switch>
        )}
      </AppContent>
      {showTweetButton && <TweetButton openModal={openModal} />}
      <AlertBar />
      {!promptProfileName && (
        <BottomNavigation
          activePage={activePage}
          handleChange={handlePageChange}
        />
      )}
    </AppWrapper>
  );
};
