import React from 'react';
import { cn } from '@utils/css';

export const TweetItem = ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li
    className={cn('mt-1.5 flex w-full flex-col flex-nowrap overflow-x-hidden', className)}
    {...props}
  >
    {children}
  </li>
);

export const TweetItemContainer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex w-full flex-row flex-nowrap items-start', className)} {...props}>
    {children}
  </div>
);

export const TweetContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('-mt-2.5 flex w-full flex-col flex-nowrap', className)} {...props}>
    {children}
  </div>
);

export const TweetContentPrimary = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex w-full flex-row flex-nowrap items-end', className)} {...props}>
    {children}
  </div>
);

export const TweetProfile = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-lg font-bold text-keyos-fg', className)} {...props}>
    {children}
  </p>
);

export const TweetDate = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ml-2.5 text-sm text-keyos-muted', className)} {...props}>
    {children}
  </span>
);

export const TweetMessage = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('break-all text-lg text-keyos-muted', className)} {...props}>
    {children}
  </div>
);

export const TweetButtonContainer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('-ml-5 mt-[3px] flex w-full flex-row flex-nowrap justify-between', className)}
    {...props}
  >
    {children}
  </div>
);
