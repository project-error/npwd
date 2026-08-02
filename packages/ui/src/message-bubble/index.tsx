import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils';

export const messageBubbleVariants = cva(
  'relative max-w-[82%] rounded-[var(--keyos-radius-lg)] leading-snug animate-in fade-in-0 slide-in-from-bottom-1',
  {
    variants: {
      from: {
        player:
          'keyos-shine-bg keyos-surface-glow ml-auto rounded-br-md border border-keyos-amber/35 bg-gradient-to-b from-keyos-amber-soft to-keyos-amber text-[color:var(--keyos-on-primary)]',
        contact:
          'keyos-shine-bg keyos-surface-panel mr-auto rounded-bl-md border border-[color:var(--keyos-border-subtle)] bg-keyos-panel-strong text-keyos-fg backdrop-blur-xl',
        system:
          'mx-auto max-w-[72%] rounded-xl border border-[color:var(--keyos-border-subtle)] bg-[color:var(--keyos-surface-overlay)] text-center text-keyos-muted',
      },
      density: {
        compact: 'px-2.5 py-1 text-[length:var(--keyos-text-caption)]',
        comfortable: 'px-3 py-1.5 text-[length:var(--keyos-text-body)]',
      },
    },
    defaultVariants: {
      from: 'contact',
      density: 'comfortable',
    },
  },
);

export interface MessageBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageBubbleVariants> {
  meta?: React.ReactNode;
}

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ children, className, density, from, meta, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(messageBubbleVariants({ from, density, className }))} {...props}>
        <div>{children}</div>
        {meta && <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] opacity-60">{meta}</div>}
      </div>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';
