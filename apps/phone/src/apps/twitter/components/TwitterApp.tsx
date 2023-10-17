import { memo, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { Tweet as ITweet } from '@typings/twitter';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import TweetListContainer from './tweet/TweetListContainer';
import AddTweetModal from './AddTweetModal';
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
import { useSetRecoilState } from 'recoil';
import { twitterState } from '../hooks/state';
import ModalBackground from './ModalBackground';
import { WordFilterProvider } from '../../../os/wordfilter/providers/WordFilterProvider';

const TwitterApp = () => {
  const setModalVisible = useSetRecoilState(twitterState.showCreateTweetModal);
  const [activePage, setActivePage] = useState(0);
  const { profile } = useProfile();
  const location = useLocation();

  // before any other action can be taken by the user we force
  // them have a profile name.
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
        <ModalBackground />
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
export default memo(TwitterApp);

/*InjectDebugData<any>(
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
        message: 'Go is better!',
        createdAt: '2021-12-01 00:42:03',
        updatedAt: '2021-12-01 00:42:03',
        identifier: '',
        retweet: null,
      },
    },
  ],
  4000,
);*/
