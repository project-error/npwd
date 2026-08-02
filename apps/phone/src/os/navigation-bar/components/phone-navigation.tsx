import React from 'react';

import { useLocation, useNavigate } from 'react-router';

import { usePhone } from '@os/phone/hooks/usePhone';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { closePhone } = usePhone();
  const isHome = pathname === '/';

  const handleHomePress = () => {
    if (isHome) {
      closePhone();
      return;
    }

    navigate('/');
  };

  return (
    <div className="flex shrink-0 items-center justify-center px-4 pb-3 pt-0.5">
      <button
        type="button"
        onClick={handleHomePress}
        aria-label={isHome ? 'Close phone' : 'Go home'}
        className="rounded-full p-3 transition active:scale-95 active:opacity-80"
      >
        <span aria-hidden className="keyos-home-indicator block" />
      </button>
    </div>
  );
};
