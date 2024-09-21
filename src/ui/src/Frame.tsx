import { useSettings } from './api/hooks/useSettings';
import { isEnvBrowser } from './utils/game';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Frame = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();
  const isGame = !isEnvBrowser();

  const scale = settings?.scale || 100;
  const mappedScale = scale / 100;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: mappedScale }}
      style={{
        transformOrigin: 'bottom right',
      }}
      className={clsx(
        'w-[390px] h-[844px] text-primary flex flex-col shadow-2xl rounded-[40px] overflow-hidden absolute',
        isGame && 'fixed bottom-0 right-0',
      )}
    >
      <div className="bg-primary rounded-[40px] flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};
