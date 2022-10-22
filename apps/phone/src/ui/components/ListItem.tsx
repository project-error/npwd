import React from 'react';
import MaterialListItem from '@mui/material/ListItem';

export const ListItem = ({ ...props }) => (
  <MaterialListItem aria-label="list item" {...props}>
    {props.children}
  </MaterialListItem>
);
