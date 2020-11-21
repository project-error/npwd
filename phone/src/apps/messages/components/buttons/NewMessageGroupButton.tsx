import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import useModals from "../../hooks/useModals";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    bottom: "25px",
    right: "15px",
  },
}));

export function NewMessageGroupButton() {
  const classes = useStyles();
  const { setShowNewMessageGroup } = useModals();

  const handleClick = () => setShowNewMessageGroup(true);

  return (
    <div className={classes.root}>
      <Fab color="primary" onClick={handleClick}>
        <AddIcon />
      </Fab>
    </div>
  );
}

export default NewMessageGroupButton;
