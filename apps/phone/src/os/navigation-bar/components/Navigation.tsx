import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { ChevronLeft, Circle, LayoutGrid } from 'lucide-react';

export const Navigation: React.FC = () => {
  const history = useHistory();
  const { isExact } = useRouteMatch('/');
  const { closePhone } = usePhone();

  const handleGoBackInHistory = () => {
    history.goBack();
  };

  const handleGoToMenu = () => {
    if (isExact) return;
    history.push('/');
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 w-full h-14 px-12">
      <div className="flex justify-between items-center h-full">
        <button onClick={handleGoToMenu}>
          <LayoutGrid className="text-neutral-400 hover:dark:text-neutral-100 h-6 w-6 hover:text-neutral-900 " />
        </button>
        <button onClick={closePhone}>
          <Circle className="text-neutral-400 hover:dark:text-neutral-100 h-6 w-6 hover:text-neutral-900 " />
        </button>
        <button onClick={handleGoBackInHistory}>
          <ChevronLeft className="text-neutral-400 hover:dark:text-neutral-100 hover:text-neutral-900 h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
