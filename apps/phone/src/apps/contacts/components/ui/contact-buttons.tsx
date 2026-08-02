import React from 'react';
import { Button, ButtonProps } from '@npwd/keyos';
import { LucideIcon } from 'lucide-react';
import { cn } from '@utils/css';

const iconButtonBaseClass =
  'flex size-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-150 active:scale-95';

export const contactIconButtonClass = {
  base: iconButtonBaseClass,
  muted: `${iconButtonBaseClass} border-[color:var(--keyos-border-muted)] bg-keyos-panel-strong text-keyos-muted hover:border-[color:var(--keyos-border-subtle)] hover:bg-keyos-panel hover:text-keyos-cream`,
  accent: `${iconButtonBaseClass} border-[color:var(--keyos-app-accent)]/30 bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] hover:opacity-90`,
  call: `${iconButtonBaseClass} border-emerald-500/30 bg-emerald-500 text-white hover:bg-emerald-400 hover:border-emerald-400/40`,
  danger: `${iconButtonBaseClass} border-red-500/30 bg-red-500 text-white hover:bg-red-400 hover:border-red-400/40`,
};

interface ContactActionProps extends Omit<ButtonProps, 'children'> {
  onClick: () => void;
  Icon: LucideIcon;
  variant?: Extract<ButtonProps['variant'], 'secondary' | 'accent' | 'success' | 'danger'>;
}

export const ContactAction: React.FC<ContactActionProps> = ({
  Icon,
  onClick,
  variant = 'secondary',
  className,
  ...props
}) => {
  return (
    <Button
      aria-label="contact action"
      className={cn(className)}
      onClick={onClick}
      size="icon-sm"
      variant={variant}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
