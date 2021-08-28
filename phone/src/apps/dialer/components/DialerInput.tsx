import React, { useContext } from 'react';
import { Box, IconButton, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputBase } from '../../../ui/components/Input';
import { useCall } from '../../../os/call/hooks/useCall';

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
  const { t } = useTranslation();
  const { initializeCall } = useCall();

  const { inputVal, set } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = (number: string) => {
    initializeCall(number);
  };

  const handleNewContact = (number: string) => {
    history.push(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
  };

  return (
    <Box component={Paper} className={classes.root}>
      <InputBase
        placeholder={t('APPS_DIALER_INPUT_PLACEHOLDER')}
        className={classes.input}
        value={inputVal}
        onChange={(e) => set(e.target.value)}
      />
      <IconButton
        color="primary"
        className={classes.iconBtn}
        disabled={inputVal <= ''}
        onClick={() => handleCall(inputVal)}
      >
        <PhoneIcon fontSize="large" />
      </IconButton>
      <IconButton className={classes.iconBtn} onClick={() => handleNewContact(inputVal)}>
        <PersonAddIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
