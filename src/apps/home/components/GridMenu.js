import React from "react";
import { AppIcon } from "../../../ui/components/AppIcon";
import { Grid, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  item: {
    marginTop: theme.spacing(3),
    width: '20%'
  }
}));

export const GridMenu = ({ apps }) => {
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid container item>
        {apps &&
          apps.length &&
          apps.map((app) => (
            <Grid
              item
              className={classes.item}
              key={app.name}
              tabindex="-1"
              component={Link}
              to="/contacts"
            >
              <AppIcon {...app} />
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};
