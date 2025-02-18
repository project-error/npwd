import { useNavigators, useSetNavigator } from '@navigation/navigator.state';

export const useInitApps = () => {
  const setNavigator = useSetNavigator();

  const modules = import.meta.glob('/src/apps/*/app.routes.ts', { eager: true });
  const apps = Object.values(modules)
    .map((mod) => mod.default)
    .filter((app) => app);

  for (const app of apps) {
    if (!app) {
      continue;
    }

    setNavigator(app);
  }

  return apps;
};

export const useApps = () => {
  const navigator = useNavigators();
  return navigator;
};
