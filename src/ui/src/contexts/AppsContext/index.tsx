import { useExternalApps } from '@/hooks/useExternalApps';
import { createContext, PropsWithChildren, ReactNode, useMemo, useState } from 'react';

export interface App {
  id: string;
  name: string;
  path: string;
  Icon: string | ReactNode;
}

interface AppsContext {
  hasInitialised: boolean;
  apps: App[];
  setApps: React.Dispatch<React.SetStateAction<App[]>>;
}

export const AppsContext = createContext<AppsContext>({
  hasInitialised: false,
  apps: [],
  setApps: () => {},
});

/** List of apps */
const defaultApps: App[] = [
  {
    id: 'calls',
    name: 'Calls',
    Icon: '📞',
    path: '/calls',
  },
  {
    id: 'casino',
    name: 'Casino',
    Icon: '🎰',
    path: '/casino',
  },
  {
    id: 'messages',
    name: 'Messages',
    Icon: '💬',
    path: '/messages',
  },
  {
    id: 'photos',
    name: 'Photos',
    Icon: '📷',
    path: '/photos',
  },
  {
    id: 'camera',
    name: 'Camera',
    Icon: '📸',
    path: '/camera',
  },
  {
    id: 'settings',
    name: 'Settings',
    Icon: '⚙️',
    path: '/settings',
  },
];

export const AppsProvider = ({ children }: PropsWithChildren) => {
  const [apps, setApps] = useState<App[]>(defaultApps);
  const { apps: externalApps, hasLoaded } = useExternalApps();

  const memoizedReturn = useMemo(() => {
    return {
      hasInitialised: true,
      apps: hasLoaded ? apps.concat(externalApps) : [],
      setApps,
    };
  }, [apps, externalApps, hasLoaded]);

  return <AppsContext.Provider value={memoizedReturn}>{children}</AppsContext.Provider>;
};
