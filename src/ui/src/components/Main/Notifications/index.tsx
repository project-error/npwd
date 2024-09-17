import {
  AnimatePresence,
  motion,
  PanInfo,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useState } from 'react';
import { clsx } from 'clsx';
import { useKeys } from '@/hooks/useKeys';
import { useDisableNavigation } from '@/contexts/NavigationContext';
import { Notification } from '@/components/Main/Notifications/Notification';
import { FooterLine } from '@/components/FooterLine';

/**
 * Convert above notifications to a list of only the props
 */
const notifications = [
  {
    key: 1,
    title: 'Example One',
    description: 'This is an example description',
    appId: 'calls',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    overline: 'Time sensitive',
  },
  {
    key: 2,
    title: 'Example Two',
    description:
      'This is another description that can become quite long and wrap around, but how long can it go? Three rows is probably enough.',
    appId: 'settings',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    key: 3,
    title: 'Example Three',
    description: 'This is another description',
    appId: 'settings',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    key: 4,
    title: 'Jackpot!',
    description: 'You have won a million dollars!',
    appId: 'casino',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    key: 5,
    title: 'New transaction',
    description: 'John Doe just sent $325.00',
    appId: 'SEND_APP',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];

export const Notifications = () => {
  const rootHeight = document.getElementById('root')?.clientHeight;
  const height = rootHeight || 844;

  const [notificationsState, setNotificationsState] = useState(notifications);
  const [scope, animate] = useAnimate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const y = useMotionValue(-height + 32);
  const transition = useSpring(y, { stiffness: 300, damping: 30 });
  const opacity = useTransform(transition, [-height + 32, -height + 32 * 12, 0], [0, 1, 1]);

  const handleDragEnd = async (event: MouseEvent, panInfo: PanInfo) => {
    const isOpen = panInfo.offset.y > -100;
    updateNotificationState(isOpen);
  };

  const updateNotificationState = (isOpen: boolean) => {
    if (isOpen) {
      animate(scope.current, { y: 0 });
    } else {
      animate(scope.current, { y: -height + 32 });
    }

    setIsNotificationsOpen(isOpen);
  };

  useDisableNavigation(isNotificationsOpen);

  useKeys({
    Escape: () => {
      if (isNotificationsOpen) {
        updateNotificationState(false);
      }
    },
  });

  return (
    <motion.div
      ref={scope}
      drag="y"
      style={{ y: transition, opacity }}
      dragConstraints={{ top: -height + 32, bottom: 0 }}
      variants={{
        open: { y: '0%', opacity: 1 },
        closed: { y: 'calc(-100% + 32px)', opacity: 1 },
      }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'absolute top-0 left-0 right-0 z-10 flex flex-col gap-2 h-full backdrop-blur-xl bg-gray-500 bg-opacity-5',
      )}
      onDragEnd={handleDragEnd}
    >
      <span className="pt-6 px-4 tracking-wide font-semibold text-xl text-primary">
        Notifications
      </span>

      <AnimatePresence>
        <motion.div className="flex flex-col gap-2 p-4" layout>
          {notificationsState.map(({ key, ...notification }) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Notification
                {...notification}
                onClose={() => setNotificationsState((prev) => prev.filter((n) => n.key !== key))}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {notificationsState.length === 0 && (
        <div className="flex flex-1 items-center justify-center">No notifications</div>
      )}

      <div className="h-8 px-6 flex gap-4 items-center mt-auto justify-center">
        <FooterLine primary />
      </div>
    </motion.div>
  );
};
