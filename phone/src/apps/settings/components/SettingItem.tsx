import React from "react";
import { ListItem, ListItemText, Divider } from "@material-ui/core";

interface IProps {
  options?: any;
  label: string;
  value: string | null;
  onClick?: any;
}

export const SettingItem = ({ options, label, value, onClick }: IProps) => {
  return (
    <>
      <ListItem onClick={() => onClick(options)} button>
        <ListItemText primary={label} secondary={value} />
      </ListItem>
      <Divider />
    </>
  );
};
