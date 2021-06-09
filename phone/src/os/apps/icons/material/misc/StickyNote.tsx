import { SvgIconProps } from '@material-ui/core/SvgIcon';
import React from 'react';
import { SvgIcon } from '@material-ui/core';

const StickyNote: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect fill="none" />
      <path d="M19,3H4.99C3.89,3,3,3.9,3,5l0.01,14c0,1.1,0.89,2,1.99,2h10l6-6V5C21,3.9,20.1,3,19,3z M7,8h10v2H7V8z M12,14H7v-2h5V14z M14,19.5V14h5.5L14,19.5z" />
    </svg>
  </SvgIcon>
);

export default StickyNote;
