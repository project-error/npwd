import React from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  gridItem: {
    fontSize: theme.typography.h5.fontSize,
    padding: theme.spacing(2),
  },
}));

interface IBtnItem {
  onClick?: (...args: any) => void;
  label: string | number;
}

const ButtonItem = ({ label, onClick }: IBtnItem) => {
  const classes = useStyles();
  return (
    <Grid key={label} item xs={4}>
      <Button fullWidth className={classes.gridItem} onClick={onClick}>
        {label}
      </Button>
    </Grid>
  );
};

export const DialGrid = () => {
  return (
    <Box>
      <Grid container justify='space-around'>
        <ButtonItem label={1} />
        <ButtonItem label={2} />
        <ButtonItem label={3} />
        <ButtonItem label={4} />
        <ButtonItem label={5} />
        <ButtonItem label={6} />
        <ButtonItem label={7} />
        <ButtonItem label={8} />
        <ButtonItem label={9} />
        <ButtonItem label='*' />
        <ButtonItem label={0} />
        <ButtonItem label='#' />
      </Grid>
    </Box>
  );
};

export default DialGrid;
