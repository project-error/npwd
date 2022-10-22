import React, { Suspense } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import { SvgIconProps } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export const createLazyAppIcon =
  (Icon: React.LazyExoticComponent<SvgIconComponent>): React.FC<SvgIconProps> =>
  (props: SvgIconProps) => {
    return (
      <Suspense fallback={<AppsIcon {...props} />}>
        <Icon {...props} />
      </Suspense>
    );
  };
