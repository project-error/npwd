// intended for use on initial application loads
import React from "react";
import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "400px",
    width: "100%",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "center",
    alignItems: "center",
  },
  progress: {
    color: "white",
  },
}));

export const AppLoader = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} size={60} />
    </div>
  );
};
