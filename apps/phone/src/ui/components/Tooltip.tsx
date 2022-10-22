import React from 'react';
import { Tooltip as TooltipProvider, TooltipProps } from '@mui/material';

export const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  // TODO: Revisit hiding tooltips when phone is hidden
  // const phoneVisible = useRecoilValue(phoneState.visibility);

  return <TooltipProvider {...props}>{children}</TooltipProvider>;
};
