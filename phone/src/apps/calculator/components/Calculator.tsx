import React, { useMemo } from 'react';
import { useCalculator, CalcButton } from '../hooks/useCalculator';
import { Grid, makeStyles, Box, Paper, Fab } from '@material-ui/core';
import { setClipboard } from '../../../os/phone/hooks/useClipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';

const useStyles = makeStyles((theme) => ({
  button: {
    fontSize: theme.typography.h5.fontSize,
    padding: theme.spacing(2),
  },
  result: {
    fontSize: theme.typography.h2.fontSize,
    textAlign: 'right',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
  },
  copyFab: {
    position: 'absolute',
    top: '16px',
    left: '16px',
  },
}));

export const Calculator = ({ ...props }) => {
  const {
    result,
    equals,
    clear,
    clearAll,
    divider,
    multiplier,
    substractor,
    adder,
    dot,
    zero,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
  } = useCalculator();

  const { addAlert } = useSnackbar();

  const classes = useStyles();
  const resultStr = useMemo(
    () =>
      result().toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      }),
    [result],
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box flexGrow={1} component={Paper} p={4} className={classes.result}>
        <Fab
          size="small"
          onClick={() => {
            setClipboard(resultStr);
            addAlert({ message: 'CALCULATOR_COPIED', type: 'info' });
          }}
          className={classes.copyFab}
        >
          <FileCopyIcon />
        </Fab>
        {resultStr}
      </Box>
      <Box>
        <Grid container justify="space-around">
          <CalcButton button={clear} className={classes.button} />
          <CalcButton button={clearAll} className={classes.button} />
          <CalcButton button={divider} className={classes.button} />
          <CalcButton button={multiplier} className={classes.button} />
          <CalcButton button={seven} className={classes.button} />
          <CalcButton button={eight} className={classes.button} />
          <CalcButton button={nine} className={classes.button} />
          <CalcButton button={substractor} className={classes.button} />
          <CalcButton button={four} className={classes.button} />
          <CalcButton button={five} className={classes.button} />
          <CalcButton button={six} className={classes.button} />
          <CalcButton button={adder} className={classes.button} />
          <CalcButton button={one} className={classes.button} />
          <CalcButton button={two} className={classes.button} />
          <CalcButton button={three} className={classes.button} />
          <CalcButton button={equals} className={classes.button} />
          <CalcButton button={dot} className={classes.button} />
          <CalcButton button={zero} className={classes.button} xs={9} />
        </Grid>
      </Box>
    </Box>
  );
};
