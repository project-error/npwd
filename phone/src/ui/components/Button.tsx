import React from 'react';
import MaterialButton from '@material-ui/core/Button';

export const Button = ({ ...props }) => {
  return (
    <MaterialButton aria-label='button' {...props}>
      {props.children}
    </MaterialButton>
  );
};
