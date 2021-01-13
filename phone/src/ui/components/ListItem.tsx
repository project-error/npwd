import React from 'react';
import MaterialListItem from '@material-ui/core/ListItem';

export const ListItem = ({ ...props }) => {
  return (
    <MaterialListItem aria-label='list item' {...props}>
      {props.children}
    </MaterialListItem>
  );
};
