import React, { useEffect, useState } from 'react';
import fetchNui from '@utils/fetchNui';
import {
  Box,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import { useApp } from '@os/apps/hooks/useApps';
import SendIcon from '@mui/icons-material/Send';
import { ServerPromiseResp } from '@typings/common';
import { Account, BankingEvents, TransactionStatus } from '@typings/banking';
import { isEnvBrowser } from '@utils/misc';
import Divider from '@mui/material/Divider';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { INotification } from '@os/notifications/providers/NotificationsProvider';
import FormControl from '@mui/material/FormControl';

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export const BankingDashboardPage: React.FC = () => {
  // const String = useExampleStringValue();

  const banking = useApp('BANKING');
  const [balance, setBalance] = useState(<LinearProgress color="success" />);
  const [iban, setIban] = useState('-');
  const { addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MARKETPLACE');

  useEffect(() => {
    if (isEnvBrowser()) {
      setTimeout(() => {
        setBalance(<span>100</span>);
        setIban('BOBBYB');
      }, 1000);
    } else {
      fetchNui<ServerPromiseResp<Account>>(BankingEvents.GET_ACCOUNTS).then((resp) => {
        setBalance(<span>{resp.data.bank}</span>);
        setIban(resp.data.iban);
      });
    }
  });

  return (
    <Box height="100%" width="100%" p={2}>
      <Typography variant={'h3'} style={{ color: 'green' }}>
        ${balance}
      </Typography>
      <InputLabel htmlFor="account-number">your IBAN:</InputLabel>
      <OutlinedInput
        id="account-number"
        label="Standard"
        style={{ width: '100%' }}
        value={iban}
        readOnly={true}
        disabled={true}
      />
      <Divider />
      <Typography variant={'h4'} style={{ color: 'white', marginTop: '3em' }}>
        Send money:
      </Typography>

      <FormControl fullWidth sx={{ m: 1 }}>
        {/*<InputLabel htmlFor="transaction-iban">IBAN</InputLabel>*/}
        <TextField
          id="transaction-iban"
          label="IBAN"
          style={{ width: '100%', marginTop: '0.5em', textTransform: 'uppercase' }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="transaction-amount">Amount</InputLabel>
        <OutlinedInput
          style={{ width: '100%', marginTop: '0.5em', appearance: 'textfield' }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  const target_iban: HTMLInputElement = document.getElementById(
                    'transaction-iban',
                  ) as HTMLInputElement;
                  const transaction_amount: HTMLInputElement = document.getElementById(
                    'transaction-amount',
                  ) as HTMLInputElement;

                  console.log('clicked');
                  fetchNui<ServerPromiseResp<TransactionStatus>>(BankingEvents.TRANSFER_MONEY, {
                    targetIBAN: target_iban.value,
                    amount: transaction_amount.value,
                  })
                    .then((resp) => {
                      let notification: INotification;
                      switch (resp.data) {
                        case TransactionStatus.SUCCESS:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:success',
                            title: 'transaction completed succesfully',
                            content: 'Succesfully transfered money to the account.',
                            icon,
                            notificationIcon,
                          };

                          break;
                        default:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:error',
                            title: 'uh oh!',
                            content: 'Something went wrong!',
                            icon,
                            notificationIcon,
                          };
                          break;
                      }
                      addNotificationAlert(notification);
                    })
                    .catch(() => {
                      let notification: INotification = {
                        app: 'BANKING',
                        id: 'banking:transaction:error',
                        title: 'uh oh!',
                        content: 'Something went wrong!',
                        icon,
                        notificationIcon,
                      };
                      addNotificationAlert(notification);
                    });
                }}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
          id="transaction-amount"
          type={'number'}
          label="Amount"
        />
      </FormControl>
      <br></br>
    </Box>
  );
};
