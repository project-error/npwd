import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { MarketplaceListContainer } from './MarketplaceList/MarketplaceListContainer';
import { NavigationBar } from './navigation/NavigationBar';
import { Switch, Route } from 'react-router-dom';
import { ListingFormContainer } from './form/ListingFormContainer';
import { MarketplaceThemeProvider } from '../providers/MarketplaceThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';

export const MarketplaceApp: React.FC = () => {
  const marketplaceApp = useApp('MARKETPLACE');

  return (
    <MarketplaceThemeProvider>
      <AppWrapper id="marketplace-app">
        <AppTitle app={marketplaceApp} />
        <AppContent>
          <WordFilterProvider>
            <Switch>
              <Route path="/marketplace" exact component={MarketplaceListContainer} />
              <Route path="/marketplace/new" component={ListingFormContainer} />
            </Switch>
          </WordFilterProvider>
        </AppContent>
        <NavigationBar />
      </AppWrapper>
    </MarketplaceThemeProvider>
  );
};
