import React from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { ChevronLeft, Circle, LayoutGrid } from 'lucide-react';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const {
    pattern: { end: isExact },
  } = useMatch({
    path: '/',
    caseSensitive: false,
    end: true,
  });

  const { closePhone } = usePhone();

  const handleGoBackInHistory = () => {
    navigate(-1);
  };

  const handleGoToMenu = () => {
    if (isExact) return;
    navigate('/');
  };

  return (
    <div className="h-14 w-full bg-neutral-100 px-12 dark:bg-neutral-900">
      <div className="flex h-full items-center justify-between">
        <button onClick={handleGoToMenu}>
          <LayoutGrid className="h-6 w-6 text-neutral-400 hover:text-neutral-900 hover:dark:text-neutral-100 " />
        </button>
        <button onClick={closePhone}>
          <Circle className="h-6 w-6 text-neutral-400 hover:text-neutral-900 hover:dark:text-neutral-100 " />
        </button>
        <button onClick={handleGoBackInHistory}>
          <ChevronLeft className="h-6 w-6 text-neutral-400 hover:text-neutral-900 hover:dark:text-neutral-100" />
        </button>
      </div>
    </div>
  );
};
