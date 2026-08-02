import React from 'react';
import { Tooltip as KeyOSTooltip, TooltipProps } from '@npwd/keyos';

export const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  // TODO: Revisit hiding tooltips when phone is hidden

  return <KeyOSTooltip {...props}>{children}</KeyOSTooltip>;
};
