import React from "react";
import { AppWrapperTypes } from '../interface/InterfaceUI';

export const AppWrapper = ({ children, style, handleClickAway, ...props }: AppWrapperTypes) => {
  return (
    <div
      {...props}
      style={{
        padding: 0,
        margin: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
