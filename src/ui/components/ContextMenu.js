import React from "react";
import {
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Slide,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.default,
    color: "black",
    zIndex: 2,
  },
}));

export const ContextMenu = ({ open, onClose, options }) => {
  const classes = useStyles();
  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <div className={classes.root}>
        <List component="nav" aria-label="context menu">
          {options.map((option) => (
            <ListItem
              button
              key={option.key}
              onClick={(e) => {
                option.onClick(e, option);
                onClose();
              }}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </div>
    </Slide>
  );
};
