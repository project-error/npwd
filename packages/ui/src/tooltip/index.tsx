import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip';
import React from 'react';
import { cn } from '../utils';

export interface TooltipProps {
  children: React.ReactElement<Record<string, unknown>>;
  className?: string;
  openDelay?: number;
  title?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, className, openDelay = 350, title }) => {
  if (!title) {
    return children;
  }

  return (
    <BaseTooltip.Provider delay={openDelay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={8}>
            <BaseTooltip.Popup
              className={cn(
                'keyos-shine-bg keyos-surface-panel z-50 rounded-lg border border-[color:var(--keyos-border-subtle)] bg-keyos-panel-strong px-2.5 py-1.5 text-xs font-medium text-keyos-cream backdrop-blur-xl',
                'transition data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
                className,
              )}
            >
              {title}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
};
