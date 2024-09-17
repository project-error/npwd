import { useEffect } from 'react';

export const useKeys = (keys: Record<string, (event: KeyboardEvent) => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const callback = keys[e.key];
      callback?.(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys]);
};
