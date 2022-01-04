import React, { useEffect, useState } from 'react';
import { RecoilRoot, RecoilValue, useRecoilRefresher_UNSTABLE, useRecoilSnapshot } from 'recoil';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { PhoneEvents } from '@typings/phone';

const RecoilCacheResetEntry = ({ node }: { node: RecoilValue<unknown> }) => {
  const resetNode = useRecoilRefresher_UNSTABLE(node);
  useEffect(() => {
    resetNode();
  }, [resetNode]);
  return null;
};

const RecoilCacheReset: React.FC = () => {
  const snapshot = useRecoilSnapshot();
  return (
    <>
      {Array.from(snapshot.getNodes_UNSTABLE()).map((node) => (
        <RecoilCacheResetEntry key={node.key} node={node} />
      ))}
    </>
  );
};
// Because how both recoil functions and how our store works, we need
// to use *somewhat* of a hack for resetting the global state. In this case,
// we just increment a counter every time we change characters in order to force
// a refresh
// This is liable to memory leaky behavior in extreme cases.

export const RecoilRootManager: React.FC = ({ children }) => {
  const [char, setChar] = useState(0);

  useNuiEvent<boolean>('PHONE', PhoneEvents.UNLOAD_CHARACTER, () => {
    setChar((curVal) => curVal + 1);
  });

  return (
    <RecoilRoot key={char}>
      <RecoilCacheReset />
      {children}
    </RecoilRoot>
  );
};
