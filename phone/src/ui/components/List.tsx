import React from 'react';
import MaterialList, { ListProps } from '@material-ui/core/List';

export const List: React.FC<ListProps> = ({ ...props }) => (
  <MaterialList aria-label="list" {...props}>
    {props.children}
  </MaterialList>
);
