import { useEffect } from 'react';

export const applyDarkMode = () => {
  document.documentElement.classList.add('dark');
};

export const useApplyDarkMode = () => {
  useEffect(() => {
    applyDarkMode();
  }, []);
};
