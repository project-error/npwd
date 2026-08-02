import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../utils';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--keyos-panel-strong)] font-semibold text-keyos-fg',
  {
    variants: {
      size: {
        sm: 'size-7 text-[length:var(--keyos-text-micro)]',
        md: 'size-9 text-[length:var(--keyos-text-caption)]',
        lg: 'size-12 text-[length:var(--keyos-text-headline)]',
        xl: 'size-16 text-[length:var(--keyos-text-title)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size,
  className,
  children,
  ...props
}) => {
  const [failed, setFailed] = React.useState(false);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt ?? ''}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        fallback ?? children
      )}
    </div>
  );
};
