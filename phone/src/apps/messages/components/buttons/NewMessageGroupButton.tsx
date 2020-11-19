import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import { amber } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    bottom: "25px",
    right: "15px",
  }
}));

export function NewMessageGroupButton() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab color="primary">
        <AddIcon />
      </Fab>
    </div>
  );
}

export default NewMessageGroupButton;
