import React from 'react';
import { Route } from 'react-router-dom';
import { AppWithStartup } from './AppWithStartup';

export const AppRoute = ({ id, emitOnOpen, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (
        <AppWithStartup id={id} emitOnOpen={emitOnOpen}>
          <Component />
        </AppWithStartup>
      )}
    />
  );
};
