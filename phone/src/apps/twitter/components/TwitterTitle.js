import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";
import TwitterIcon from "@material-ui/icons/Twitter";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "60px",
    width: "100%",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "center",
    alignItems: "center",
    background: "#424242",
  },
  icon: {
    color: "#00acee",
    fontSize: 30,
  },
}));

export function TwitterTitle() {
  const classes = useStyles();
  return (
    <Paper elevation={24} variant="outlined" square className={classes.root}>
      <TwitterIcon className={classes.icon} />
    </Paper>
  );
}

export default TwitterTitle;
