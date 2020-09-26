import React from "react";
import { Box, makeStyles, Backdrop, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: "67vh",
    overflow: "auto",
  },
  box: {
    width: "100%",
    height: "100%", // allow application to fill entireity of space
    position: "relative",
    overflow: "auto",
  },
  backdrop: {
    position: "absolute",
    zIndex: 1,
  },
  paper: {
    width: "100%",
    height: "100%", // allow application to fill entireity of space
  },
}));

export const AppContent = ({
  children,
  style,
  backdrop,
  onClickBackdrop,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.wrapper}>
      <Box flexGrow={1} className={classes.box} {...props}>
        <Paper square px={2} pt={1} elevation={0} className={classes.paper}>
          <Backdrop
            className={classes.backdrop}
            open={backdrop || false}
            onClick={onClickBackdrop}
          ></Backdrop>
          {children}
        </Paper>
      </Box>
    </Paper>
  );
};
