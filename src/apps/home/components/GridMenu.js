import React from "react";
import { AppIcon } from "./AppIcon";

export const GridMenu = ({ apps }) => {
  return (
    <div style={{ display: "flex" }}>
      {apps.map((app) => (
        <div style={{ flex: '1 1 20%',  }}>
          <AppIcon icon={app.icon} label={app.name} />
        </div>
      ))}
    </div>
  );
};
