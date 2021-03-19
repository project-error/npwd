import React, { useState } from 'react';
import { Route } from 'react-router-dom';

import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { MatchThemeProvider } from '../providers/MatchThemeProvider';

import MatchPage from '../components/views/MatchPage';
import MatchBottomNavigation from '../components/BottomNavigation';

export const MatchApp = () => {
  const match = useApp('MATCH');
  const [activePage, setActivePage] = useState(0);

  const handlePageChange = (e, page) => setActivePage(page);

  return (
    <MatchThemeProvider>
      <AppWrapper id="contact-app">
        <AppTitle app={match} />
        <AppContent>
          <Route path="/match/" exact component={MatchPage} />
        </AppContent>
        <MatchBottomNavigation activePage={activePage} handleChange={handlePageChange} />
      </AppWrapper>
    </MatchThemeProvider>
  );
};

InjectDebugData(
  [
    {
      app: 'MATCH',
      method: 'setProfiles',
      data: [
        {
          id: 1,
          image:
            'https://cdn.vox-cdn.com/thumbor/9xCALlkm2Mc0HQk8kMr1Ui3YNbc=/0x0:5464x3070/920x613/filters:focal(2295x1098:3169x1972):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/67031748/shutterstock_1450403549.0.jpg',
          name: 'Person Alpha',
          bio:
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
          createdAt: 1615932985,
          updatedAt: 1615932985,
          lastActive: 1616004986,
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
        },
        {
          id: 3,
          image: 'https://www.langan.com/wp-content/uploads/2019/02/Boston-996x554.jpg',
          name: 'Person Charlie',
          bio: 'ut aut reiciendis voluptatibus',
          createdAt: 1615850185,
          updatedAt: 1615850185,
          lastActive: 1613607385,
        },
      ],
    },
  ],
  200,
);
