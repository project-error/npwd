import React from "react";
import { Box, makeStyles, Backdrop } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  box: {
    width: "100%",
    position: "relative",
  },
  backdrop: {
    position: "absolute",
    zIndex: 1,
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
    <Box
      px={2}
      pt={1}
      flexGrow={1}
      style={{ width: "100%", ...props }}
      {...props}
    >
      <Backdrop
        className={classes.backdrop}
        open={backdrop}
        onClick={onClickBackdrop}
      ></Backdrop>
      {children}
    </Box>
  );
};
