import React from "react";

export const AppWrapper = ({ children, style, ...props }) => {
  return (
    <div
      {...props}
      style={{
        padding: 0,
        margin: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
