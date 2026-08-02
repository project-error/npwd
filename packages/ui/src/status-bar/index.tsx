import React from 'react';
import { BatteryFull, Bell, SignalMedium, Wifi } from 'lucide-react';

import { cn } from '../utils';

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  showSignal?: boolean;
  showWifi?: boolean;
  showBattery?: boolean;
  showNotifications?: boolean;
  notificationIcons?: React.ReactNode;
  playerId?: React.ReactNode;
  onPress?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time,
  leading,
  trailing,
  showSignal = true,
  showWifi = true,
  showBattery = true,
  showNotifications = true,
  notificationIcons,
  playerId,
  onPress,
  className,
  ...props
}) => (
  <div
    className={cn(
      'relative z-[99] flex h-[var(--keyos-status-bar-height)] w-full shrink-0 items-end justify-between px-[var(--keyos-safe-x)] pb-1 text-keyos-fg',
      onPress && 'cursor-pointer',
      className,
    )}
    onClick={onPress}
    role={onPress ? 'button' : undefined}
    {...props}
  >
    <div className="flex min-w-0 items-center gap-1.5 pt-1.5">
      {leading}
      {time && (
        <span className="text-[length:var(--keyos-text-body)] font-semibold tabular-nums tracking-tight">
          {time}
        </span>
      )}
      {playerId}
    </div>

    <div className="flex items-center gap-1.5 pt-1.5 text-keyos-fg">
      {trailing}
      {showNotifications &&
        (notificationIcons ?? <Bell className="size-3.5 text-keyos-muted" aria-hidden />)}
      {showWifi && <Wifi className="size-3.5" aria-hidden />}
      {showSignal && <SignalMedium className="size-3.5" aria-hidden />}
      {showBattery && <BatteryFull className="size-4 text-emerald-400" aria-hidden />}
    </div>
  </div>
);
