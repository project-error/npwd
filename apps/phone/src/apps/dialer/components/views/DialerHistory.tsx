import React, { useCallback } from 'react';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { List } from '@ui/components/List';
import { ListItem } from '@ui/components/ListItem';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { CallHistoryItem } from '@typings/call';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, ListItemIcon, ListItemText, useTheme, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useDialHistory } from '../../hooks/useDialHistory';
import { useCall } from '@os/call/hooks/useCall';
import { useContacts } from '../../../contacts/hooks/state';

const useStyles = makeStyles((theme: Theme) => ({
  callForward: {
    color: theme.palette.success.main,
  },
  callBack: {
    color: theme.palette.error.main,
  },
}));

export const DialerHistory: React.FC = () => {
  const myNumber = useMyPhoneNumber();
  const { getDisplayByNumber } = useContactActions();
  const { initializeCall } = useCall();
  const calls = useDialHistory();
  const classes = useStyles();
  const contacts = useContacts();
  const history = useHistory();
  const [t] = useTranslation();
  const phoneTheme = useTheme();

  const handleCall = (phoneNumber) => {
    initializeCall(phoneNumber);
  };

  // To display the name, force a re-render when we get contacts | issue #432
  const getDisplay = useCallback(
    (number: string) => (contacts.length ? getDisplayByNumber(number) : number),
    [contacts, getDisplayByNumber],
  );

  if (!calls?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" paddingTop={35}>
        <p>
          {
            <Typography style={{ color: phoneTheme.palette.text.primary }}>
              {t('DIALER.NO_HISTORY')}
            </Typography>
          }
          <span role="img" aria-label="sad">
            😞
          </span>
        </p>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {calls.map((call: CallHistoryItem) =>
        call.transmitter === myNumber ? (
          <ListItem key={call.id} divider>
            <ListItemIcon>
              <PhoneForwardedIcon className={classes.callForward} />
            </ListItemIcon>

            <ListItemText
              primary={getDisplay(call.receiver)}
              secondary={
                <Typography style={{ color: phoneTheme.palette.text.secondary }}>
                  {dayjs().to(dayjs.unix(parseInt(call.start)))}
                </Typography>
              }
              primaryTypographyProps={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: phoneTheme.palette.text.primary,
              }}
            />
            <IconButton onClick={() => handleCall(call.receiver)} size="large">
              {<PhoneIcon />}
            </IconButton>

            {getDisplay(call.receiver) === call.receiver && (
              <IconButton
                onClick={() =>
                  history.push(`/contacts/-1?addNumber=${call.receiver}&referal=/phone/contacts`)
                }
                size="large"
              >
                <PersonAddIcon />
              </IconButton>
            )}
          </ListItem>
        ) : (
          <ListItem key={call.id} divider>
            <ListItemIcon>
              <PhoneCallbackIcon className={classes.callBack} />
            </ListItemIcon>

            <ListItemText
              primary={call.isAnonymous ? 'Anonymous' : getDisplay(call.transmitter)}
              secondary={
                <Typography style={{ color: phoneTheme.palette.text.secondary }}>
                  {dayjs().to(dayjs.unix(parseInt(call.start)))}
                </Typography>
              }
              primaryTypographyProps={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: phoneTheme.palette.text.primary,
              }}
            />

            <IconButton
              onClick={() => handleCall(call.transmitter)}
              size="large"
              disabled={call.isAnonymous}
            >
              <PhoneIcon />
            </IconButton>

            {!call.isAnonymous && getDisplay(call.transmitter) === call.transmitter && (
              <IconButton
                onClick={() =>
                  history.push(`/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`)
                }
                size="large"
              >
                <PersonAddIcon />
              </IconButton>
            )}
          </ListItem>
        ),
      )}
    </List>
  );
};
