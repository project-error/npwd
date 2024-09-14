import { isEnvBrowser } from './utils/game';
import { clsx } from 'clsx';

export const Frame = ({ children }: { children: React.ReactNode }) => {
  const isGame = !isEnvBrowser();

  return (
    <div
      className={clsx(
        'w-[390px] h-[844px] text-primary flex flex-col shadow-2xl rounded-[40px] overflow-hidden',
        isGame && 'fixed bottom-0 right-0 scale-90',
      )}
    >
      <div className="bg-primary rounded-[40px] flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};
