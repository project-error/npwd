import React from 'react';
import { AppIcon } from './AppIcon';
import { Box, Grid } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

export const GridMenu = ({ items, Component = AppIcon, xs = undefined }) => {
  const history = useHistory()
  const handleOnClick = (e, path) => {
    // not preventing default here will lead to us crashing CEF if someone Shift + Clicks
    e.preventDefault()
    history.push(path)
  }
  return (
    <Grid container alignItems="center" direction="row">
      {items &&
        items.length &&
        items.map((item) => (
          <Grid item xs={xs} key={item.id}>
            <Box textAlign="center">
              <Link to={item.path} onClick={(e) => handleOnClick(e, item.path)}>
                <Component {...item} />
              </Link>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
