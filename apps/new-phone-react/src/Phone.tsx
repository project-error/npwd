import {  RouterProvider } from 'react-router';
import { createRouter } from '@navigation/navigator';
import {  useInitApps } from '@system/hooks/useApps';

function Phone() {
  const apps = useInitApps();
  const router = createRouter(apps);

  return <RouterProvider router={router} />
}

export default Phone;