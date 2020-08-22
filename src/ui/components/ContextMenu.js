import React from "react";
import {
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Slide,
  makeStyles,
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 2,
  },
}));

export const ContextMenu = ({ open, onClose, options }) => {
  const classes = useStyles();
  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper square className={classes.root}>
        <List aria-label="context menu">
          {options.map((option) => (
            <ListItem
              selected={option.selected}
              button
              key={option.key || option.label}
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
      </Paper>
    </Slide>
  );
};
