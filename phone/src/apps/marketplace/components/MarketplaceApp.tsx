import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { MarketplaceListContainer } from './MarketplaceList/MarketplaceListContainer';
import { NavigationBar } from './navigation/NavigationBar';
import { Switch, Route } from 'react-router-dom';
import { ListingFormContainer } from './form/ListingFormContainer';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { MarketplaceThemeProvider } from '../providers/MarketplaceThemeProvider';
import { MarketplaceEvents } from '../../../../../typings/marketplace';
import { AppTitle } from '../../../ui/components/AppTitle';
import { useApp } from '../../../os/apps/hooks/useApps';

export const MarketplaceApp = () => {
  const marketplaceApp = useApp('MARKETPLACE');

  return (
    <MarketplaceThemeProvider>
      <AppWrapper id="sellout-app">
        <AppTitle app={marketplaceApp} />
        <AppContent>
          <Switch>
            <Route path="/marketplace" exact component={MarketplaceListContainer} />
            <Route path="/marketplace/new" component={ListingFormContainer} />
          </Switch>
        </AppContent>
        <NavigationBar />
      </AppWrapper>
    </MarketplaceThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'SELLOUT',
    method: MarketplaceEvents.SEND_LISTING,
    data: [
      {
        id: 1,
        name: 'Some guy',
        number: '111-1134',
        title: 'eeeeeeeeeeeeeeeeeeeeeeeee',
        description:
          'skldfsdEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        url: 'https://beta.iodine.gg/706Y3.jpeg',
      },
      {
        id: 2,
        name: 'Some other dude',
        number: '666-6666',
        title: 'Material',
        description: 'Selling my wife',
        url: '',
      },
    ],
  },
]);
