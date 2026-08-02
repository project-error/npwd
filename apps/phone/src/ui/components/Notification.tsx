import React, { useEffect } from 'react';
import { ToastStack } from '@npwd/keyos';
import { usePhone } from '@os/phone/hooks/usePhone';
import { cn } from '@utils/css';

interface NotificationProps {
  open: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
}

const horizontalPositionClasses = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
} as const;

export const Notification: React.FC<NotificationProps> = ({ children, handleClose, open }) => {
  const { ResourceConfig } = usePhone();

  useEffect(() => {
    if (!open) return undefined;

    const timer = window.setTimeout(() => {
      handleClose();
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [open, handleClose]);

  if (!ResourceConfig || !open) return null;

  const { horizontal, vertical } = ResourceConfig.notificationPosition;

  return (
    <ToastStack
      className={cn(
        '-z-[5] pointer-events-auto px-0',
        horizontalPositionClasses[horizontal] ?? 'items-center',
      )}
      position={vertical === 'bottom' ? 'bottom' : 'top'}
    >
      <div
        className="keyos-shine-bg keyos-surface-panel h-[100px] w-[350px] rounded-2xl border border-[color:var(--keyos-border-subtle)] bg-keyos-panel/95 p-4 opacity-95 backdrop-blur-xl animate-in fade-in-0 duration-300"
        onClick={handleClose}
        role="presentation"
      >
        {children}
      </div>
    </ToastStack>
  );
};

export default Notification;
