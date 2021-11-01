import React from 'react';
import { Tooltip as TooltipProvider, TooltipProps } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { phoneState } from '../../os/phone/hooks/state';

export const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  const phoneVisible = useRecoilValue(phoneState.visibility);

  return (
    <TooltipProvider {...props} open={!phoneVisible ? false : undefined}>
      {children}
    </TooltipProvider>
  );
};
