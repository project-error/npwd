import React, { useContext } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputBase } from '@ui/components/Input';
import { useCall } from '@os/call/hooks/useCall';

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

export const DialerInput: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [t] = useTranslation();
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
        size="large"
      >
        <PhoneIcon fontSize="large" />
      </IconButton>
      <IconButton
        className={classes.iconBtn}
        onClick={() => handleNewContact(inputVal)}
        size="large"
      >
        <PersonAddIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
