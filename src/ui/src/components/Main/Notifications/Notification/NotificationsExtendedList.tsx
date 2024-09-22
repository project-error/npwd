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
import { FooterLine } from '@/components/FooterLine';
import { useNotifications } from '@/contexts/NotificationContext/useNotifications';
import { Button } from '@/components/ui/button';
import { ExtendedNotification } from './ExtendedNotification';

interface NotificationsExtendedListProps {
  onChangeOpen: (isOpen: boolean) => void;
}
export const NotificationsExtendedList = ({
  onChangeOpen: onToggle,
}: NotificationsExtendedListProps) => {
  const rootHeight = document.getElementById('root')?.clientHeight;
  const [isDraggingNotification, setIsDraggingNotification] = useState(false);
  const height = rootHeight || 844;

  const { notifications, remove, clear } = useNotifications();
  const [scope, animate] = useAnimate();

  const y = useMotionValue(-height + 32);
  const transition = useSpring(y, { stiffness: 300, damping: 30 });
  const opacity = useTransform(transition, [-height + 32, -height + 32 * 12, 0], [0, 1, 1]);

  const handleDragEnd = async (_: unknown, panInfo: PanInfo) => {
    if (isDraggingNotification) {
      return;
    }

    const velocity = Math.abs(panInfo.velocity.y);

    if (velocity < 70) {
      const isOpen = panInfo.point.y < height / 2;
      updateNotificationState(!isOpen);
      return;
    }

    const isOpen = panInfo.velocity.y > -100;
    updateNotificationState(isOpen);
  };

  const updateNotificationState = (isOpen: boolean) => {
    if (isOpen) {
      animate(scope.current, { y: 0 });
    } else {
      animate(scope.current, { y: -height + 32 });
    }

    onToggle(isOpen);
  };

  return (
    <motion.div
      ref={scope}
      drag={!isDraggingNotification ? 'y' : false}
      style={{ y: transition, opacity }}
      dragConstraints={{ top: -height + 32, bottom: 0 }}
      variants={{
        open: { y: '0%', opacity: 1 },
        closed: { y: 'calc(-100% + 32px)', opacity: 1 },
      }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'absolute top-0 left-0 right-0 z-10 flex flex-col gap-2 h-full bg-secondary bg-opacity-60',
      )}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-between p-6 pb-2">
        <span className="tracking-wide font-semibold text-xl text-primary">Notifications</span>

        <Button variant="ghost" onClick={clear}>
          Clear all
        </Button>
      </div>

      <div className="flex flex-col overflow-auto mr-2 scrollbar scroll-m-4">
        <div className="flex flex-col gap-2 p-4 pr-2">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                layout
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -400 }}
              >
                <ExtendedNotification
                  notification={notification}
                  onClick={() => onToggle(false)}
                  onClose={() => remove(notification.id)}
                  onDragChange={setIsDraggingNotification}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-1 items-center justify-center">No notifications</div>
      )}

      <div className="h-8 px-6 flex gap-4 items-center mt-auto justify-center">
        <FooterLine primary />
      </div>
    </motion.div>
  );
};
