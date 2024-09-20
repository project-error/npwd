import { Notification as NotificationType } from '@/contexts/NotificationContext';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NotificationContent } from './NotificationContent';

interface NotificationProps {
  notification: NotificationType;
  appId?: string;
  isFirst?: boolean;
  overline?: string;
  isLatest?: boolean;
  onClick?: () => void;
  onClose: () => void;
  onDragChange: (isDragging: boolean) => void;
}

export const Notification = ({
  isFirst,
  onClose,
  onClick,
  notification,
  isLatest = false,
  onDragChange,
}: NotificationProps) => {
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, -100, 0], [0, 1, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    onDragChange(false);
    if (info.offset.x < -250 || info.offset.y < -100) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isLatest) {
      return;
    }

    const interval = setTimeout(() => {
      onClose();
    }, 30 * 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [isLatest]);

  const handleClick = () => {
    navigate(notification.path);
    onClose();
    onClick?.();
  };

  return (
    <motion.div
      layout
      onClick={handleClick}
      drag={isLatest && isFirst ? 'y' : 'x'}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onDragStart={() => onDragChange(true)}
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      exit={{ x: isLatest ? 0 : -250, y: isLatest ? 0 : -400 }}
      style={{ x, opacity }}
    >
      <NotificationContent notification={notification} extended={!isLatest} />
    </motion.div>
  );
};
