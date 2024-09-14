import { useEffect, useRef } from 'react';

export const useEffectOnce = (effect: React.EffectCallback) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      effect();
      hasRun.current = true;
    }
  }, [effect]);
};
