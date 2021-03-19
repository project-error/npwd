import React, { useContext } from 'react';
import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import Nui from '../../../os/nui-events/utils/Nui';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  const { inputVal, set } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = (number: string) => {
    Nui.send('phone:beginCall', {
      number,
    });
  };

  const handleNewContact = (number: string) => {
    history.push(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
  };

  return (
    <Box component={Paper} className={classes.root}>
      <InputBase
        placeholder="Enter a number"
        className={classes.input}
        value={inputVal}
        onChange={(e) => set(e.target.value)}
      />
      <IconButton color="primary" className={classes.iconBtn} disabled={inputVal <= ''}>
        <PhoneIcon fontSize="large" onClick={() => handleCall(inputVal)} />
      </IconButton>
      <IconButton className={classes.iconBtn}>
        <PersonAddIcon fontSize="large" onClick={() => handleNewContact(inputVal)} />
      </IconButton>
    </Box>
  );
};
