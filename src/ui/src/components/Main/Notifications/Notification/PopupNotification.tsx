import { Notification } from '@/contexts/NotificationContext';
import { NotificationContent } from './NotificationContent';
import { useNavigate } from 'react-router';
import { motion, PanInfo } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Phone } from 'react-feather';
import { instance } from '@/utils/fetch';
import { useActiveCall } from '@/api/hooks/useActiveCall';

interface PopupNotificationProps {
  drag: 'x' | 'y';
  notification: Notification;
  onClose: () => void;
  onClick?: () => void;
}

export const PopupNotification = ({
  drag,
  onClose,
  onClick,
  notification,
}: PopupNotificationProps) => {
  const [, invalidate] = useActiveCall();
  const navigate = useNavigate();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -250 || info.offset.y < -100) {
      onCloseRef.current();
    }
  };

  const handleClick = () => {
    navigate(notification.path);
    onClick?.();
    onCloseRef.current();
  };

  useEffect(() => {
    if (notification.timeout === 0 || !notification.dismissable) return;

    const timeout = setTimeout(() => {
      onCloseRef.current();
    }, notification.timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [notification.timeout]);

  const handleAcceptCall = () => {
    navigate('/apps/calls/call?action=accept');
    onCloseRef.current();
  };

  const handleDeclineCall = async () => {
    await instance.post('/calls/active/decline', {});
    invalidate();
  };

  return (
    <motion.div
      key={notification.id}
      layout
      drag={drag}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      initial={{ opacity: 0, y: -120 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: drag === 'y' ? -250 : 0,
        x: drag === 'x' ? -400 : 0,
      }}
      onDragEnd={handleDragEnd}
    >
      <NotificationContent
        onClick={handleClick}
        notification={notification}
        Actions={
          notification.type === 'call' && (
            <div className="flex gap-2">
              <button
                autoFocus
                className="text-xs text-primary font-semibold bg-rose-500 p-2 rounded-full rotate-[135deg]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeclineCall();
                  onClose();
                }}
              >
                <Phone />
              </button>

              <button
                className="text-xs text-primary font-semibold bg-green-400 p-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptCall();
                }}
              >
                <Phone />
              </button>
            </div>
          )
        }
      />
    </motion.div>
  );
};
