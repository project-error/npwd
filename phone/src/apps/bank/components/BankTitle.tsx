import React from "react";
import Paper from "@material-ui/core/Paper";
import { Typography ,makeStyles } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90px",
    width: "100%",
    display: "block",
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    background: "#424242",
  },
  icon: {
    color: "#f44336",
    fontSize: 40,
  },
}));


export const BankTitle = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} square variant="outlined" elevation={24}>
      <Typography style={{ margin: 0}} variant="h4">WhoDis Banking</Typography>


      <Typography variant="subtitle2">Some player name</Typography>
    </Paper>
  );
};
