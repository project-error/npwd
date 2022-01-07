import React, { useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Tweet as ITweet } from '@typings/twitter';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import TweetListContainer from './tweet/TweetListContainer';
import AddTweetModal from './AddTweetModal';
import { useModal } from '../hooks/useModal';
import TweetButton from './buttons/TweetButton';
import TwitterTitle from './TwitterTitle';
import BottomNavigation from './BottomNavigation';
import TwitterProfile from './profile/Profile';
import TwitterSearch from './TwitterSearch';

import './twitter.css';
import 'emoji-mart/css/emoji-mart.css';
import { useProfile } from '../hooks/useProfile';
import ProfilePrompt from './profile/ProfilePrompt';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { TwitterThemeProvider } from '../providers/TwitterThemeProvider';
import { TwitterEvents } from '@typings/twitter';

const useStyles = makeStyles(() => ({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

export const TwitterApp = () => {
  const classes = useStyles();
  const { modalVisible, setModalVisible } = useModal();
  const [activePage, setActivePage] = useState(0);
  const { profile } = useProfile();
  const location = useLocation();

  // before any other action can be taken by the user we force
  // them have a profile name.
  const promptProfileName = !profile || !profile.profile_name || !profile.profile_name.trim();

  const openModal = () => setModalVisible(true);
  const handlePageChange = (e, page) => setActivePage(page);
  const showTweetButton =
    !promptProfileName && activePage === 0 && location.pathname === '/twitter';

  return (
    <TwitterThemeProvider>
      <AppWrapper id="twitter-app">
        <AddTweetModal />
        <div className={modalVisible ? classes.backgroundModal : undefined} />
        <TwitterTitle />
        <AppContent>
          {promptProfileName ? (
            <ProfilePrompt />
          ) : (
            <>
              <Route path="/twitter" exact component={TweetListContainer} />
              <Route path="/twitter/search" component={TwitterSearch} />
              <Route path="/twitter/profile" component={TwitterProfile} />
            </>
          )}
        </AppContent>
        {showTweetButton && <TweetButton openModal={openModal} />}
        {!promptProfileName && (
          <BottomNavigation activePage={activePage} handleChange={handlePageChange} />
        )}
      </AppWrapper>
    </TwitterThemeProvider>
  );
};

InjectDebugData<ITweet>(
  [
    {
      app: 'TWITTER',
      method: TwitterEvents.CREATE_TWEET_BROADCAST,
      data: {
        profile_id: 41433131,
        profile_name: 'Bombay_Dev',
        isMine: false,
        isLiked: false,
        retweetId: '',
        isRetweet: false,
        seconds_since_tweet: 1639,
        retweetProfileName: '',
        retweetAvatarUrl: '',
        isReported: false,
        retweetIdentifier: '',
        avatar_url: '',
        id: 115,
        message: 'TypeScript sucks!',
        createdAt: '2021-12-01 00:42:03',
        updatedAt: '2021-12-01 00:42:03',
        identifier: '',
        retweet: null,
      },
    },
    {
      app: 'TWITTER',
      method: TwitterEvents.CREATE_TWEET_BROADCAST,
      data: {
        profile_id: 41433131,
        profile_name: 'Tabarra',
        isMine: false,
        isLiked: false,
        retweetId: '',
        isRetweet: false,
        seconds_since_tweet: 1639,
        retweetProfileName: '',
        retweetAvatarUrl: '',
        isReported: false,
        retweetIdentifier: '',
        avatar_url:
          'https://cdn.discordapp.com/avatars/272800190639898628/a_3560bc4a514b0dcb4098cc33e5c92e49.gif?size=4096',
        id: 10000,
        message: 'I am the txadmen',
        createdAt: '2021-12-01 00:42:03',
        updatedAt: '2021-12-01 00:42:03',
        identifier: '',
        retweet: null,
      },
    },
  ],
  4000,
);
