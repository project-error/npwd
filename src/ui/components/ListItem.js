import React from "react";
import MaterialListItem from "@material-ui/core/ListItem";

export const ListItem = ({ ...props }) => {
  return (
    <MaterialListItem {...props} aria-label="list item">
      {props.children}
    </MaterialListItem>
  );
};
