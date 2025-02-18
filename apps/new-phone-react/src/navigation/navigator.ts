import { Launcher } from '@apps/Launcher';
import { PhoneFrame } from '@native/components/PhoneFrame';
import { createHashRouter, RouteObject } from 'react-router';

export type AppNavigation = RouteObject & {
  name: string;
};

// not sure why we have this right now, but we might add some stuff in here later????
function createRoutes(navigators: RouteObject[]): RouteObject[] {
  return navigators;
}

export function createRouter(navigators: RouteObject[]) {
  return createHashRouter([
    {
      path: '/',
      Component: PhoneFrame,
      children: [
        {
          index: true,
          Component: Launcher,
        },
        ...createRoutes(navigators),
      ],
    },
  ]);
}
