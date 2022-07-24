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
import { Account, BankingEvents, TransactionResult, TransactionStatus } from '@typings/banking';
import { isEnvBrowser } from '@utils/misc';
import Divider from '@mui/material/Divider';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { INotification } from '@os/notifications/providers/NotificationsProvider';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@ui/components/Input';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import makeStyles from '@mui/styles/makeStyles';
import { formatMoney } from '../../utils/banking.utils';

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
  const [clickable, setClickable] = useState<boolean>(false);

  useEffect(() => {
    if (isEnvBrowser()) {
      setTimeout(() => {
        setBalance(<span>100</span>);
        setIban('BOBBYB');
      }, 1000);
    } else {
      fetchNui<ServerPromiseResp<Account>>(BankingEvents.GET_ACCOUNTS)
        .then((resp) => {
          if (resp.data) {
            setBalance(<span>{formatMoney(resp.data.bank)}</span>);
            setIban(resp.data.iban);
          }
        })
        .catch(() => {
          let notification: INotification = {
            app: 'BANKING',
            id: 'banking:transaction:error',
            title: '404',
            content: 'Not found',
            icon,
            notificationIcon,
            sound: true,
          };
          addNotificationAlert(notification);
        });
    }
  }, [updater]);

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
      <Typography
        variant={'h4'}
        style={{ color: 'rgb(33, 150, 243)', marginTop: '3em', textAlign: 'center' }}
      >
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
                // style={{ display: `${click ? 'none' : 'block'}` }}
                onClick={() => {
                  if (!clickable) return;
                  setClickable(false);
                  const target_iban: HTMLInputElement = document.getElementById(
                    'transaction-iban',
                  ) as HTMLInputElement;
                  const transaction_amount: HTMLInputElement = document.getElementById(
                    'transaction-amount',
                  ) as HTMLInputElement;

                  // saves data to temp variables.
                  const targetIbanValue: string = target_iban.value.toUpperCase();
                  const targetAmount: string = transaction_amount.value;

                  // Clear Data + Disable button.
                  //setClick(true);

                  // resets values.
                  target_iban.value = '';
                  transaction_amount.value = '';
                  console.log('Attempting transfer..');
                  if (isEnvBrowser()) {
                    let notification: INotification = {
                      app: 'BANKING',
                      id: 'banking:transaction:invalid_iban',
                      title: 'success',
                      content: 'mock success',
                      icon,
                      notificationIcon,
                    };
                    addNotificationAlert(notification);
                    return;
                  }

                  fetchNui<ServerPromiseResp<TransactionStatus>>(BankingEvents.TRANSFER_MONEY, {
                    targetIBAN: targetIbanValue,
                    amount: targetAmount,
                  })
                    .then((resp) => {
                      let notification: INotification;
                      console.log(resp.data);
                      switch (resp.data) {
                        case TransactionStatus.SUCCESS:
                          console.log('transferring..');
                          break;
                        case TransactionStatus.INVALID_TARGET_IBAN:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:invalid_iban',
                            title: 'no such iban',
                            content: 'The IBAN you provided does not exist',
                            icon,
                            notificationIcon,
                          };
                          break;
                        case TransactionStatus.INVALID_NUMBER:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:hackerman',
                            title: 'Hackerman',
                            content: 'That is not even a number!?',
                            icon,
                            notificationIcon,
                          };
                          break;
                        case TransactionStatus.INSUFFICIENT_BALANCE:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:insufficient_balance',
                            title: 'Poor man',
                            content: 'You do not have this amount of money',
                            icon,
                            notificationIcon,
                          };
                          break;
                        default:
                          notification = {
                            app: 'BANKING',
                            id: 'banking:transaction:error',
                            title: 'uh oh!',
                            content: `Something went wrong (default)!`,
                            icon,
                            notificationIcon,
                          };
                          break;
                      }
                      addNotificationAlert(notification);
                      setTimeout(function () {
                        setClickable(true);
                        setUpdater(updater + 1);
                      }, 500);
                    })
                    .catch(() => {
                      console.log('error in banking dashboard');
                      let notification: INotification = {
                        app: 'BANKING',
                        id: 'banking:transaction:error',
                        title: 'error!',
                        content: 'Bobby didnt test this...',
                        icon,
                        notificationIcon,
                      };
                      addNotificationAlert(notification);
                      setTimeout(function () {
                        setClickable(true);
                        setUpdater(updater + 1);
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
