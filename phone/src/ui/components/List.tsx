import React from 'react';
import MaterialList from '@material-ui/core/List';

export const List = ({ ...props }) => {
  return (
    <MaterialList aria-label='list' {...props}>
      {props.children}
    </MaterialList>
  );
};
