import React from 'react';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { List } from '../../../../ui/components/List';
import { ListItem } from '../../../../ui/components/ListItem';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useSimcard } from '../../../../os/simcard/hooks/useSimcard';
import { useContacts } from '../../../contacts/hooks/useContacts';
import { CallEvents, CallHistoryItem } from '../../../../../../typings/call';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme: Theme) => ({
  callForward: {
    color: theme.palette.success.main,
  },
  callBack: {
    color: theme.palette.error.main,
  },
}));

export const DialerHistory = ({ calls }) => {
  const Nui = useNuiRequest();
  const { number: myNumber } = useSimcard();
  const { getDisplayByNumber } = useContacts();

  const classes = useStyles();

  const history = useHistory();

  const { t } = useTranslation();

  const handleCall = (phoneNumber) => {
    Nui.send(CallEvents.INITIALIZE_CALL, {
      number: phoneNumber,
    });
  };

  if (!calls?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" paddingTop={35}>
        <p>
          {t('APPS_DIALER_NO_HISTORY')}
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
              primary={getDisplayByNumber(call.receiver)}
              secondary={
                // TODO: Locale changes are pending #168 merge
                dayjs().to(dayjs.unix(call.start))
              }
            />
            <IconButton onClick={() => handleCall(call.receiver)}>{<PhoneIcon />}</IconButton>

            {getDisplayByNumber(call.receiver) === call.receiver && (
              <IconButton
                onClick={() =>
                  history.push(`/contacts/-1?addNumber=${call.receiver}&referal=/phone/contacts`)
                }
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
              primary={getDisplayByNumber(call.transmitter)}
              secondary={
                // TODO: Locale changes are pending #168 merge
                dayjs().to(dayjs.unix(call.start))
              }
            />
            <IconButton onClick={() => handleCall(call.transmitter)}>
              <PhoneIcon />
            </IconButton>

            {getDisplayByNumber(call.transmitter) === call.transmitter && (
              <IconButton
                onClick={() =>
                  history.push(`/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`)
                }
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
