import React from 'react';
import { AppWrapper } from '../../../ui/components/AppWrapper';
import { AppContent } from '../../../ui/components/AppContent';
import { SelloutTitle } from './SelloutTitle';
import { SelloutListContainer } from './SelloutList/SelloutListContainer';
import { NavigationBar } from './navigation/NavigationBar';
import { Switch, Route } from 'react-router-dom';
import { ListingFormContainer } from './form/ListingFormContainer';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { SelloutThemeProvider } from '../providers/SelloutThemeProvider';

export const SelloutApp = () => {
  return (
    <SelloutThemeProvider>
      <AppWrapper id="sellout-app">
        <SelloutTitle />
        <AppContent>
          <Switch>
            <Route path="/sellout" exact component={SelloutListContainer} />
            <Route path="/sellout/new" component={ListingFormContainer} />
          </Switch>
        </AppContent>
        <NavigationBar />
      </AppWrapper>
    </SelloutThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'SELLOUT',
    method: 'setListings',
    data: [
      {
        id: 1,
        name: 'Some guy',
        number: '123-4567',
        title: 'Car',
        description: 'Selling this cool car',
        url: 'https://i.imgur.com/ROmGTwi.jpeg',
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
