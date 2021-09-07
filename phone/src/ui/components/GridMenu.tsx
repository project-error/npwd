import React from 'react';
import { AppIcon } from './AppIcon';
import { Box, Grid, GridSize } from '@mui/material';
import { Link } from 'react-router-dom';
import { IApp } from '../../os/apps/config/apps';

interface GridMenuProps {
  items: IApp[];
  Component?: React.ElementType;
  xs?: GridSize;
}

export const GridMenu: React.FC<GridMenuProps> = ({ items, Component = AppIcon, xs }) => {
  return (
    <Grid container alignItems="center" direction="row">
      {items &&
        items.length &&
        items.map((item) => (
          <Grid item xs={xs} key={item.id}>
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
