import React from "react";
import { AppWrapper } from "../../../ui/components/AppWrapper";
import { AppContent } from "../../../ui/components/AppContent";
import { SelloutTitle } from "./SelloutTitle";
import { SelloutListContainer } from "./SelloutList/SelloutListContainer";
import { NavigationBar } from "./navigation/NavigationBar";
import { Switch, Route } from "react-router-dom";

import "./Sellout.css";
import { ListingFormContainer } from "./form/ListingFormContainer";

export const SelloutApp = () => {
  return (
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
  );
};
