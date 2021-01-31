import React from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { DialInputCtx } from '../context/InputContext';

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
    <DialInputCtx.Consumer>
      {({ add, removeOne, clear }) => (
        <Box>
          <Grid container justify='space-around'>
            <ButtonItem label={1} onClick={() => add(1)} />
            <ButtonItem label={2} onClick={() => add(2)} />
            <ButtonItem label={3} onClick={() => add(3)} />
            <ButtonItem label={4} onClick={() => add(4)} />
            <ButtonItem label={5} onClick={() => add(5)} />
            <ButtonItem label={6} onClick={() => add(6)} />
            <ButtonItem label={7} onClick={() => add(7)} />
            <ButtonItem label={8} onClick={() => add(8)} />
            <ButtonItem label={9} onClick={() => add(9)} />
            <ButtonItem label='*' onClick={clear} />
            <ButtonItem label={0} onClick={() => add(0)} />
            <ButtonItem label='#' onClick={removeOne} />
            <ButtonItem label='-' onClick={() => add('-')} />
          </Grid>
        </Box>
      )}
    </DialInputCtx.Consumer>
  );
};

export default DialGrid;
