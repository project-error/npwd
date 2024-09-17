import { useApps } from './useApps';

export const useApp = (id: string) => {
  const apps = useApps();
  const app = apps.find((app) => app.id === id);

  console.log(app, apps);

  return app;
};
