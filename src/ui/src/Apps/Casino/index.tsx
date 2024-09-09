import { useEffect } from 'react';
import { TopNavigation } from '../../components/Navigation/TopNavigation';

export const CasinoApp = () => {
  useEffect(() => {
    document.title = 'Casino';
  }, []);

  return (
    <div className="flex flex-col gap-2 flex-1 h-full overflow-hidden">
      <TopNavigation title="Casino" />
      <span>hello I am casino app</span>
    </div>
  );
};
