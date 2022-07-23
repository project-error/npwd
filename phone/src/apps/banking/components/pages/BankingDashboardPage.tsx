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
import { TextField } from '@ui/components/Input';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SavingsIcon from '@mui/icons-material/Savings';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  numberInput: {
    width: '100%',
    marginTop: '0.5em',
    appearance: 'textfield',
    '&[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

export const BankingDashboardPage: React.FC = () => {
  const classes = useStyles();
  const banking = useApp('BANKING');
  const [balance, setBalance] = useState(<LinearProgress color="success" />);
  const [iban, setIban] = useState('-');
  const { addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MARKETPLACE');
  const [updater, setUpdater] = useState(0);
  const [click, setClick] = useState<boolean>(false);

  useEffect(() => {
    if (isEnvBrowser()) {
      setTimeout(() => {
        setBalance(<span>100</span>);
        setIban('BOBBYB');
      }, 1000);
    } else {
      fetchNui<ServerPromiseResp<Account>>(BankingEvents.GET_ACCOUNTS).then((resp) => {
        if (resp.data) {
          setBalance(<span>{resp.data.bank}</span>);
          setIban(resp.data.iban);
        }
      });
    }
  });

  return (
    <Box height="100%" width="100%" p={2}>
      <Typography variant={'h3'} style={{ color: 'rgb(33, 150, 243)' }}>
        ${balance}
      </Typography>
      <InputLabel htmlFor="account-number" />
      <OutlinedInput
        id="account-number"
        label="Standard"
        style={{ width: '100%' }}
        value={`IBAN: ${iban}`}
        readOnly={true}
        disabled={true}
      />
      <Divider />
      <Typography variant={'h4'} style={{ color: 'white', marginTop: '3em', textAlign: 'center' }}>
        <ForwardToInboxIcon /> Send money ⬇
      </Typography>

      <FormControl fullWidth sx={{ m: 1 }}>
        <TextField
          id="transaction-iban"
          label="IBAN"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
          style={{ width: '100%', marginTop: '0.5em', textTransform: 'uppercase' }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="transaction-amount">Amount</InputLabel>
        <OutlinedInput
          className={classes.numberInput}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                style={{ display: `${click ? 'none' : 'block'}` }}
                onClick={() => {
                  const target_iban: HTMLInputElement = document.getElementById(
                    'transaction-iban',
                  ) as HTMLInputElement;
                  const transaction_amount: HTMLInputElement = document.getElementById(
                    'transaction-amount',
                  ) as HTMLInputElement;

                  // saves data to temp variables.
                  const targetIbanValue: string = target_iban.value;
                  const targetAmount: string = transaction_amount.value;

                  // Clear Data + Disable button.
                  setClick(true);

                  // resets values.
                  target_iban.value = '';
                  transaction_amount.value = '';

                  fetchNui<ServerPromiseResp<TransactionStatus>>(BankingEvents.TRANSFER_MONEY, {
                    targetIBAN: targetIbanValue,
                    amount: targetAmount,
                  })
                    .then((resp) => {
                      setUpdater(updater + 1);
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
                        case TransactionStatus.INVALID_TARGET_IBAN:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:invalid_iban',
                            title: 'no such iban',
                            content: 'The IBAN you provided',
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
                      setTimeout(function () {
                        setClick(false);
                      }, 500);
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
                      setTimeout(function () {
                        setClick(false);
                      }, 500);
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
