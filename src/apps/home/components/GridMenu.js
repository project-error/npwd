import React from "react";
import { AppIcon } from "../../../ui/components/AppIcon";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

export const GridMenu = ({ apps }) => {
  return (
    <Grid container>
      {apps && apps.length && apps.map((app) => (
        <Grid item xs={3} key={app.name} component={Link} to="/contacts">
            <AppIcon {...app} />
        </Grid>
      ))}
    </Grid>
  );
};
