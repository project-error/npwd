import React from 'react';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { List } from '../../../../ui/components/List';
import { ListItem } from '../../../../ui/components/ListItem';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { CallEvents, CallHistoryItem } from '../../../../../../typings/call';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useMyPhoneNumber } from '../../../../os/simcard/hooks/useMyPhoneNumber';
import { useDialHistory } from '../../hooks/useDialHistory';

const useStyles = makeStyles((theme: Theme) => ({
  callForward: {
    color: theme.palette.success.main,
  },
  callBack: {
    color: theme.palette.error.main,
  },
}));

export const DialerHistory: React.FC = () => {
  const { addAlert } = useSnackbar();
  const myNumber = useMyPhoneNumber();
  const { getDisplayByNumber } = useContactActions();
  const calls = useDialHistory();

  const classes = useStyles();

  const history = useHistory();

  const { t } = useTranslation();
  const handleCall = (phoneNumber) => {
    fetchNui<ServerPromiseResp>(CallEvents.INITIALIZE_CALL, {
      receiverNumber: phoneNumber,
    }).then((resp) => {
      if (resp.status === 'error') {
        addAlert({ message: t('CALLS.FEEDBACK.ERROR'), type: 'error' });
        console.error(resp.errorMsg);
      }
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
                dayjs().to(dayjs.unix(parseInt(call.start)))
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
                dayjs().to(dayjs.unix(parseInt(call.start)))
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
