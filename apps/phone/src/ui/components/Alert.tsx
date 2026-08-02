import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@utils/css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

const severityClasses = {
  error: 'border-red-400/40 bg-red-500/20 text-red-100',
  info: 'border-sky-400/40 bg-sky-500/20 text-sky-100',
  success: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-100',
  warning: 'border-keyos-amber/50 bg-keyos-amber/20 text-keyos-cream',
};

export const Alert: React.FC<AlertProps> = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const { children, className, onClose, severity = 'info', ...rest } = props;

  return (
    <div
      className={cn(
        'keyos-shine-bg keyos-surface-panel z-[10000] flex max-w-[320px] items-start gap-3 rounded-2xl border px-4 py-3 text-base backdrop-blur-xl',
        severityClasses[severity],
        className,
      )}
      ref={ref}
      role="alert"
      {...rest}
    >
      <div className="min-w-0 flex-1 break-words">{children}</div>
      {onClose && (
        <button
          aria-label="Close alert"
          className="rounded-full p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

export default Alert;
