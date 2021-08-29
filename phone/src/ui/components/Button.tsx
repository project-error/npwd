import React from 'react';
import MaterialButton from '@material-ui/core/Button';
import { ButtonProps } from '@material-ui/core';

export const Button: React.FC<ButtonProps> = ({ ...props }) => (
  <MaterialButton aria-label="button" {...props}>
    {props.children}
  </MaterialButton>
);
