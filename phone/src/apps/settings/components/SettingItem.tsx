import React from "react";
import { ListItem, ListItemText, Divider } from "@material-ui/core";

export const SettingItem = ({ options, label, value, onClick }) => {
  return (
    <>
      <ListItem onClick={() => onClick(options)} button>
        <ListItemText primary={label} secondary={value} />
      </ListItem>
      <Divider />
    </>
  );
};
