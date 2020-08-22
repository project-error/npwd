import React from "react";
import { Typography, Box } from "@material-ui/core";

export const AppTitle = ({ children, style, ...props }) => {
  return (
    <Box px={2} pt={4} style={{ width: '100%', ...props }} {...props}>
        <Typography paragraph variant="h4">{children}</Typography>
    </Box>
  );
};
