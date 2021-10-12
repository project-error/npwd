import React from 'react';
import { TooltipProps } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { phoneState } from '../../os/phone/hooks/state';

export const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  const phoneVisible = useRecoilValue(phoneState.visibility);

  return (
    <Tooltip {...props} open={!phoneVisible ? false : undefined}>
      {children}
    </Tooltip>
  );
};
