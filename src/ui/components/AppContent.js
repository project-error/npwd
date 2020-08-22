import React from "react";
import { Box } from "@material-ui/core";

export const AppContent = ({ children, style, ...props }) => {
  return (
    <Box px={2} pt={1} style={{ width: '100%', ...props }} {...props}>
        {children}
    </Box>
  );
};
