import { useApp } from '@/contexts/AppsContext/useApp';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

interface NotificationProps {
  title: string;
  description: string;
  appId?: string;
  overline?: string;
  created_at: string;
  onClose?: () => void;
}

export const Notification = ({
  title,
  description,
  overline,
  created_at,
  onClose,
  appId = 'settings',
}: NotificationProps) => {
  const app = useApp(appId);
  const AppIcon = app ? app.Icon : '📢';

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, -100, 0], [0, 1, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -250) {
      onClose?.();
    }
  };

  useEffect(() => {
    console.log(app);
  }, []);

  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      className="flex p-3 items-center gap-3 bg-gray-800 rounded-lg relative bg-opacity-5 backdrop-blur-md"
      onDragEnd={handleDragEnd}
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      style={{ x, opacity }}
    >
      <span className="p-1 bg-secondary rounded-lg text-2xl w-10 h-10 flex flex-col items-center justify-center">
        {AppIcon}
      </span>
      <div className="flex flex-col">
        {overline && (
          <span className="uppercase text-[10px] font-semibold line-clamp-3 tracking-wider">
            {overline}
          </span>
        )}
        <span className="text-primary font-semibold text-sm">{title}</span>
        <span className="text-secondary">{description}</span>
      </div>
      <span className="text-xs opacity-40 absolute top-0 right-0 m-3">
        {DateTime.fromISO(created_at).toFormat('t')}
      </span>
    </motion.div>
  );
};
