import React from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  root: ({ color }) => ({
    width: '100%',
    textAlign: 'center',
    backgroundColor: color || theme.palette.background.default
  }),
  text: {
    color: theme.palette.text.primary
  }
}));

export const AppTitle = ({ children, color, ...props }) => {
  const classes = useStyle({ color });
  return (
    <Box px={2} pt={4} className={classes.root} {...props}>
        <Typography className={classes.text} paragraph variant="h4">{children}</Typography>
    </Box>
  );
};
