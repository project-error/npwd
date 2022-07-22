import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  InputLabel,
  OutlinedInput,
  CircularProgress,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useExampleStringValue } from '../hooks/state';
import { useApp } from '@os/apps/hooks/useApps';
import SendIcon from '@mui/icons-material/Send';

export const BankingApp: React.FC = () => {
  // const String = useExampleStringValue();

  const banking = useApp('BANKING');
  const [balance, setBalance] = useState(<CircularProgress style={{ color: 'white' }} />);
  return (
    <Box height="100%" width="100%" p={2}>
      <Typography variant={'h3'} style={{ color: 'green' }}>
        ${balance}
      </Typography>

      <InputLabel htmlFor="account-number">Account:</InputLabel>
      <OutlinedInput id="account-number" label="Standard" />

      <InputLabel htmlFor="balance">Amount:</InputLabel>
      <OutlinedInput
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
    </Box>
  );
};
