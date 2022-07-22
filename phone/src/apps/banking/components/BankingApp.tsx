import React, { useEffect, useState } from 'react';
import fetchNui from '@utils/fetchNui';
import {
  Box,
  Typography,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import { useApp } from '@os/apps/hooks/useApps';
import SendIcon from '@mui/icons-material/Send';
import { ServerPromiseResp } from '@typings/common';
import { Account, BankingEvents } from '@typings/banking';
import { isEnvBrowser } from '@utils/misc';
const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export const BankingApp: React.FC = () => {
  // const String = useExampleStringValue();

  const banking = useApp('BANKING');
  const [balance, setBalance] = useState(<LinearProgress color="success" />);
  const [iban, setIban] = useState(<LinearProgress color="success" />);

  useEffect(() => {
    if (isEnvBrowser()) {
      setTimeout(() => {
        setBalance(<span>100</span>);
        setIban(<span style={{ textTransform: 'uppercase' }}>BOBBYB</span>);
      }, 1000);
    } else {
      fetchNui<ServerPromiseResp<Account>>(BankingEvents.GET_ACCOUNTS).then((resp) => {
        setBalance(<span>{resp.data.bank}</span>);
        setIban(<span>resp.data.iban</span>);
      });
    }
  });

  return (
    <Box height="100%" width="100%" p={2}>
      <Typography variant={'h3'} style={{ color: 'green' }}>
        ${balance}
      </Typography>

      <br></br>
      <Typography variant={'h4'} style={{ color: 'white' }}>
        Send money:
      </Typography>

      <InputLabel htmlFor="account-number">IBAN:</InputLabel>
      <OutlinedInput id="account-number" label="Standard" style={{ width: '100%' }} />

      <InputLabel htmlFor="balance">Amount:</InputLabel>
      <OutlinedInput
        style={{ width: '100%' }}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
        endAdornment={
          <InputAdornment position="end">
            <IconButton>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        id="balance"
        label="Standard"
      />
      <br></br>

      <AppBar
        position="absolute"
        style={{ backgroundColor: 'rgb(33, 150, 243)', padding: '1em' }}
        sx={{ top: 'auto', bottom: 0 }}
      >
        <Typography variant={'h6'} style={{ color: 'white' }}>
          IBAN: {iban}
        </Typography>
      </AppBar>
    </Box>
  );
};
