import React from 'react';
import MaterialButton from '@mui/material/Button';
import { ButtonProps } from '@mui/material';

export const Button: React.FC<ButtonProps> = ({ ...props }) => (
  <MaterialButton aria-label="button" {...props}>
    {props.children}
  </MaterialButton>
);
