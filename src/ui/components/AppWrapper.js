import React from "react";

export const AppWrapper = ({ children, style, ...props }) => {
  return (
    <div
      {...props}
      style={{ width: "100%", height: "100%", display: "flex", ...style }}
    >
      <div style={{ padding: "1em" }}>{children}</div>
    </div>
  );
};
