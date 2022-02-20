import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MarketplaceThemeProvider } from '../providers/MarketplaceThemeProvider';
import MarketplaceHome from './Home/MarketplaceHome';
import MarketplaceListing from './Listing/MarketplaceListing';
import MarketPlaceCreate from './MarketplaceCreate';
import MarketPlaceEdit from './MarketplaceEdit';

const MarketplaceApp: React.FC = () => {
  return (
    <MarketplaceThemeProvider>
      <AppWrapper id="marketplace-app">
        <AppContent>
          <Switch>
            <Route path="/marketplace" exact component={MarketplaceHome} />
            <Route path="/marketplace/new" exact component={MarketPlaceCreate} />
            <Route path="/marketplace/:id/edit" component={MarketPlaceEdit} />
            <Route path="/marketplace/:id" component={MarketplaceListing} />
          </Switch>
        </AppContent>
      </AppWrapper>
    </MarketplaceThemeProvider>
  );
};

export default MarketplaceApp;
