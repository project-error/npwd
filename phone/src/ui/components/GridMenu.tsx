import React from 'react';
import { AppIcon } from './AppIcon';
import { Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const GridMenu = ({ items, Component = AppIcon, xs = undefined }) => {
  return (
    <Grid container alignItems="center" direction="row">
      {items &&
        items.length &&
        items.map((item) => (
          <Grid item xs={xs} key={item.id} alignItems="center" justify="center">
            <Box textAlign="center">
              <Link to={item.path}>
                <Component {...item} />
              </Link>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
