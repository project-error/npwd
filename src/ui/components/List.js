import React from "react";
import MaterialList from "@material-ui/core/List";

export const List = ({ ...props }) => {
  return (
    <MaterialList {...props} aria-label="list">
      {props.children}
    </MaterialList>
  );
};
