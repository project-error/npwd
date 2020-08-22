import React from "react";
import { AppIcon } from "./AppIcon";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

export const GridMenu = ({ apps }) => {
  return (
    <Grid container spacing={1}>
      {apps && apps.length && apps.map((app) => (
        <Grid item key={app.name} component={Link} to="/contacts">
            <AppIcon icon={app.icon} label={app.name} />
        </Grid>
      ))}
    </Grid>
  );
};
