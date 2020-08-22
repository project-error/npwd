import React from "react";
import { AppIcon } from "./AppIcon";
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

export const GridMenu = ({ items, Component = AppIcon }) => {
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid container item>
        {items &&
          items.length &&
          items.map((item) => (
            <Grid
              item
              className={classes.item}
              key={item.name}
              tabindex="-1"
              component={Link}
              to={item.path}
            >
              <Component {...item} />
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};
