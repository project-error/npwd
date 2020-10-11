import React from "react";
import { makeStyles, Typography, Grid, IconButton } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SignalIcon from "@material-ui/icons/SignalCellular3Bar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: fade(theme.palette.background.paper, 0.7),
    height: "25px",
    width: "100%",
    color: theme.palette.text.primary,
    zIndex: 2,
  },
  item: {
    margin: "0 6px",
  },
  text: {
    position: "relative",
    bottom: "2px",
    color: theme.palette.text.primary,
  },
  icon: {
    padding: "4px",
    color: theme.palette.text.primary,
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
        {notifications.map((notification) => (
          <Grid
            item
            key={notification.key}
            component={IconButton}
            className={classes.icon}
          >
            {notification.icon}
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
          >{`AT&T`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
