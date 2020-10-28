import React, { useEffect } from "react";
import { AppIcon } from "./AppIcon";
import { Grid, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useKeyboard } from "../../os/keyboard/hooks/useKeyboard";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  item: {
    marginTop: theme.spacing(3),
    width: "20%",
  },
}));

export const GridMenu = ({ items, Component = AppIcon }) => {
  const setKey = useKeyboard();
  const classes = useStyles();

  useEffect(function registerKeyHandlers() {
    setKey("ArrowLeft", () => {
      console.log(":v");
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container justify="center">
      <Grid container item>
        {items &&
          items.length &&
          items.map((item) => (
            <Grid
              key={item.id}
              item
              className={classes.item}
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
