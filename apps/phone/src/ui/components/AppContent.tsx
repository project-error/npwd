import React from 'react';

import { AppContentTypes } from '../interface/InterfaceUI';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { Backdrop, cn } from '@npwd/keyos';

export const AppContent: React.FC<AppContentTypes & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  paperStyle,
  backdrop,
  disableSuspenseHandler,
  onClickBackdrop,
  className,
  ...props
}) => (
  <div
    className={cn(
      'keyos-hide-scrollbar relative flex flex-1 flex-col bg-keyos-night text-keyos-fg',
      backdrop ? 'overflow-hidden' : 'overflow-auto',
      className,
    )}
    {...props}
  >
    <Backdrop open={backdrop || false} onClick={onClickBackdrop} />
    <div className="w-full grow flex-auto" style={paperStyle}>
      {!disableSuspenseHandler ? (
        <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
      ) : (
        children
      )}
    </div>
  </div>
);
