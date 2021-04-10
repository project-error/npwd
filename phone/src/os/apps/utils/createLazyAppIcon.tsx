import React, { Suspense } from 'react';
import AppsIcon from '@material-ui/icons/Apps';
import { SvgIconProps } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

export const createLazyAppIcon = (
  Icon: React.LazyExoticComponent<SvgIconComponent>,
): React.FC<SvgIconProps> => (props: SvgIconProps) => {
  return (
    <Suspense fallback={<AppsIcon {...props} />}>
      <Icon {...props} />
    </Suspense>
  );
};
