import { memo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import TweetListContainer from './tweet/TweetListContainer';
import AddTweetModal from './AddTweetModal';
import TweetButton from './buttons/TweetButton';
import { LifeInvaderTitle } from './TwitterTitle';
import BottomNavigation from './BottomNavigation';
import TwitterProfile from './profile/Profile';
import TwitterSearch from './TwitterSearch';

import './twitter.css';
import 'emoji-mart/css/emoji-mart.css';
import { useProfile } from '../hooks/useProfile';
import ProfilePrompt from './profile/ProfilePrompt';
import { TwitterThemeProvider } from '../providers/TwitterThemeProvider';
import { useSetCreateTweetModal } from '../hooks/state';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';
import InjectDebugData from '@os/debug/InjectDebugData';
import { TwitterEvents } from '@typings/twitter';

const TwitterApp = () => {
  const setModalVisible = useSetCreateTweetModal();
  const [activePage, setActivePage] = useState(0);
  const { profile } = useProfile();
  const location = useLocation();

  // Before any other action can be taken by the user, force a profile name.
  const promptProfileName = !profile || !profile.profile_name || !profile.profile_name.trim();

  const openModal = () => setModalVisible(true);
  const handlePageChange = (_, page) => setActivePage(page);
  const showTweetButton =
    !promptProfileName && activePage === 0 && location.pathname === '/twitter';

  return (
    <TwitterThemeProvider>
      <AppWrapper id="twitter-app">
        <WordFilterProvider>
          <AddTweetModal />
        </WordFilterProvider>
        <LifeInvaderTitle />
        <AppContent>
          {promptProfileName ? (
            <ProfilePrompt />
          ) : (
            <Routes>
              <Route path="/twitter" element={<TweetListContainer />} />
              <Route path="/twitter/search" element={<TwitterSearch />} />
              <Route path="/twitter/profile" element={<TwitterProfile />} />
            </Routes>
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

export default memo(TwitterApp);

InjectDebugData<any>(
  [
    {
      app: 'TWITTER',
      method: TwitterEvents.CREATE_TWEET_BROADCAST,
      data: {
        appId: 'TWITTER',
        profile_id: 423443442,
        profile_name: 'Chip',
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
        id: 116,
        message: 'Go is better! Here is why: Go is a statically typed, compiled language in the tradition of C, with memory safety, garbage collection, structural typing, and CSP-style concurrency. The compiler, tools, and source code are all free and open source.',
        createdAt: '2021-12-01 00:42:03',
        updatedAt: '2021-12-01 00:42:03',
        identifier: '',
        retweet: null,
      },
    },
  ],
  4000,
);
