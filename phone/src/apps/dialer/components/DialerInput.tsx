import React from 'react';
import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import { DialInputCtx } from '../context/InputContext';
import Nui from '../../../os/nui-events/utils/Nui';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'right',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    display: 'flex',
    height: 100,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.h6.fontSize,
  },
  iconBtn: {
    padding: 10,
  },
}));

export const DialerInput = () => {
  const classes = useStyles();

  const handleCall = (number: string) => {
    Nui.send('phone:beginCall', {
      number
    })
  }

  return (
    <DialInputCtx.Consumer>
      {({ inputVal, add }) => (
        <Box component={Paper} className={classes.root}>
        <InputBase 
          placeholder='Enter a number' 
          className={classes.input} 
          value={inputVal}
        />
        <IconButton className={classes.iconBtn}>
          <PhoneIcon onClick={() => handleCall(inputVal)} />
        </IconButton>
      </Box>
      )}
    </DialInputCtx.Consumer>
  );
};
