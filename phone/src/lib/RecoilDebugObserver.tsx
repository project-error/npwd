import React, { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';

export const RecoilDebugObserver: React.FC = ({ children }) => {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    // Enable debugging atom mutation if needed
    //if (!defaultConfig.debug.shouldShowAtomDebug) return;

    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return <>{children}</>;
};
