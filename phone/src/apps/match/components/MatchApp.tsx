import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { MatchThemeProvider } from '../providers/MatchThemeProvider';
import { useNuiRequest } from 'fivem-nui-react-lib';
import MatchBottomNavigation from '../components/BottomNavigation';
import MatchPage from './views/MatchPage';
import ProfileEditor from './views/ProfileEditor';
import MatchList from './views/MatchList';
import { MatchEvents } from '../../../../../typings/match';
import { useProfile } from '../hooks/useProfile';

export const MatchApp = () => {
  const Nui = useNuiRequest();
  const match = useApp('MATCH');
  const [activePage, setActivePage] = useState(0);
  const { noProfileExists } = useProfile();

  useEffect(() => {
    Nui.send(MatchEvents.INITIALIZE);
  }, [Nui]);

  const handlePageChange = (e, page) => setActivePage(page);

  return (
    <MatchThemeProvider>
      <AppWrapper id="contact-app">
        <AppTitle app={match} />
        {noProfileExists ? (
          <AppContent>
            <ProfileEditor />
          </AppContent>
        ) : (
          <>
            <AppContent>
              <Route path="/match/" exact component={MatchPage} />
              <Route path="/match/matches" exact component={MatchList} />
              <Route path="/match/profile" exact component={ProfileEditor} />
            </AppContent>
            <MatchBottomNavigation activePage={activePage} handleChange={handlePageChange} />
          </>
        )}
      </AppWrapper>
    </MatchThemeProvider>
  );
};

InjectDebugData(
  [
    {
      app: 'MATCH',
      method: MatchEvents.GET_PROFILES_SUCCESS,
      data: [
        {
          id: 1,
          image:
            'https://cdn.vox-cdn.com/thumbor/9xCALlkm2Mc0HQk8kMr1Ui3YNbc=/0x0:5464x3070/920x613/filters:focal(2295x1098:3169x1972):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/67031748/shutterstock_1450403549.0.jpg',
          name: 'Evan You',
          bio: 'Husband, father of two, independent open source developer. Creator / project lead of @vuejs, @vite_js and connoisseur of sushi.',
          createdAt: 1615932985,
          updatedAt: 1615932985,
          lastActive: 1616004986,
          job: 'Gardener',
          location: 'Grapeseed',
          tags: 'shit framework, vue sucks',
          phoneNumber: '987-6543',
        },
        {
          id: 2,
          image:
            'https://media.cntraveler.com/photos/5f8f09c3a078e9112956774d/16:9/w_1600%2Cc_limit/Chicago-GettyImages-1065188752.jpg',
          name: 'Person Beta',
          bio: 'l impedit quo minus id quod maxime placeat facere possimus',
          createdAt: 1615846585,
          updatedAt: 1615846585,
          lastActive: 1615850185,
          job: 'Mechanic',
          location: 'Harmony',
          tags: 'tinkering,robotics',
          phoneNumber: '654-3219',
        },
        {
          id: 3,
          image: 'https://www.langan.com/wp-content/uploads/2019/02/Boston-996x554.jpg',
          name: 'Person Charlie',
          bio: 'ut aut reiciendis voluptatibus',
          createdAt: 1615850185,
          updatedAt: 1615850185,
          lastActive: 1613607385,
          job: 'Lawyer',
          location: 'Los Santos',
          tags: 'reading,coolstuff, coffee',
          phoneNumber: '123-4567',
        },
      ],
    },
    {
      app: 'MATCH',
      method: MatchEvents.GET_MY_PROFILE_SUCCESS,
      data: {
        id: 4,
        image:
          'https://www.middlebury.edu/institute/sites/www.middlebury.edu.institute/files/styles/1040x585/public/2018-10/Nashville-skyline.jpg?fv=mS11EKrT&itok=HNhHqYUX',
        name: 'Kire Says',
        bio: "Kire's cool profile that has many cool things. And others.",
        createdAt: 1615932985,
        updatedAt: 1615932985,
        lastActive: 1616004986,
        job: 'Engineer',
        location: 'Boston',
        tags: 'code,books',
        phoneNumber: '999-9999',
      },
    },
    {
      app: 'MATCH',
      method: MatchEvents.GET_MATCHES_SUCCESS,
      data: [
        {
          id: 5,
          image:
            'https://media.cntraveler.com/photos/5f8f09c3a078e9112956774d/16:9/w_1600%2Cc_limit/Chicago-GettyImages-1065188752.jpg',
          name: 'Person Delta',
          bio: 'l impedit quo minus id quod maxime placeat facere possimus',
          createdAt: 1615846585,
          updatedAt: 1615846585,
          lastActive: 1615850185,
          matchedAt: 1613607385,
          job: 'Mechanic',
          location: 'Harmony',
          tags: 'tinkering,robotics',
          phoneNumber: '654-3219',
        },
        {
          id: 6,
          image: 'https://www.langan.com/wp-content/uploads/2019/02/Boston-996x554.jpg',
          name: 'Person Echo',
          bio: 'ut aut reiciendis voluptatibus',
          createdAt: 1615850185,
          updatedAt: 1615850185,
          lastActive: 1613607385,
          job: 'Lawyer',
          location: 'Los Santos',
          tags: 'reading,coolstuff, coffee',
          phoneNumber: '123-4567',
          matchedAt: 1613607385,
        },
      ],
    },
  ],
  200,
);
