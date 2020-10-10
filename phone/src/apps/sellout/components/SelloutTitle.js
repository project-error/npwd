import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

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
    color: "#f44336",
    fontSize: 40,
  },
}));

export const SelloutTitle = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} square variant="outlined" elevation={24}>
      <LinkedInIcon className={classes.icon} />
    </Paper>
  );
};
