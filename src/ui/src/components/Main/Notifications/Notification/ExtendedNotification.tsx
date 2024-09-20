import { Notification as NotificationType } from '@/contexts/NotificationContext';
import { Notification } from '.';
import { motion } from 'framer-motion';

interface ExtendedNotificationProps {
  notification: NotificationType;
  onClose: () => void;
  onClick: () => void;
  onDragChange: (isDragging: boolean) => void;
}

export const ExtendedNotification = ({
  notification,
  onDragChange,
  onClick,
  onClose,
}: ExtendedNotificationProps) => {
  return (
    <motion.div
      layout
      key={notification.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -400 }}
    >
      <Notification
        notification={notification}
        onClick={onClick}
        onClose={onClose}
        onDragChange={onDragChange}
      />
    </motion.div>
  );
};
