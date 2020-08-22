import React from "react";
import { makeStyles, Typography, Grid } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SignalIcon from "@material-ui/icons/SignalCellular3Bar";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: fade(grey[800], 0.7),
    height: "25px",
    width: "100%",
    color: "white",
  },
  item: {
    margin: "0 6px",
  },
  text: {
    position: "relative",
    bottom: "2px",
  },
}));

export const NotificationBar = ({ notifications = [] }) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      justify="space-between"
      wrap="nowrap"
    >
      <Grid container item wrap="nowrap">
        {notifications.map((n) => (
          <Grid item className={classes.item}>
            {n}
          </Grid>
        ))}
      </Grid>
      <Grid container item wrap="nowrap" justify="flex-end">
        <Grid item>
          <SignalIcon fontSize="small" />
        </Grid>
        <Grid item className={classes.item}>
          <Typography
            className={classes.text}
            variant="button"
            color="white"
          >{`AT&T`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
