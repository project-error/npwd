import React, { useCallback } from 'react';
import { List, ListItem, NPWDButton } from '@npwd/keyos';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { CallHistoryItem } from '@typings/call';
import { useTranslation } from 'react-i18next';
import { Box, useTheme, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useDialHistory } from '../../hooks/useDialHistory';
import { useCall } from '@os/call/hooks/useCall';
import { useContacts } from '../../../contacts/hooks/state';
import { Phone, PhoneForwarded, PhoneIncoming, UserRoundPlus } from 'lucide-react';

export const DialerHistory: React.FC = () => {
  const myNumber = useMyPhoneNumber();
  const { getDisplayByNumber } = useContactActions();
  const { initializeCall } = useCall();
  const calls = useDialHistory();
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
    <div className="px-4">
      <List>
        {calls.map((call: CallHistoryItem) =>
          call.transmitter === myNumber ? (
            <ListItem
              primaryText={getDisplay(call.receiver)}
              secondaryText={dayjs().to(dayjs.unix(parseInt(call.start)))}
              startElement={<PhoneForwarded size={20} className="text-green-400" />}
              endElement={
                <div>
                  <NPWDButton
                    onClick={() => handleCall(call.receiver)}
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Phone size={20} />
                  </NPWDButton>
                  {getDisplay(call.receiver) === call.receiver && (
                    <NPWDButton
                      onClick={() =>
                        history.push(
                          `/contacts/-1?addNumber=${call.receiver}&referal=/phone/contacts`,
                        )
                      }
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                    >
                      <UserRoundPlus size={20} />
                    </NPWDButton>
                  )}
                </div>
              }
            />
          ) : (
            <ListItem
              primaryText={call.isAnonymous ? 'Anonymous' : getDisplay(call.transmitter)}
              secondaryText={dayjs().to(dayjs.unix(parseInt(call.start)))}
              startElement={<PhoneIncoming className="text-red-400" size={20} />}
              endElement={
                <div>
                  <NPWDButton
                    onClick={() => handleCall(call.transmitter)}
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    disabled={call.isAnonymous}
                  >
                    <Phone size={20} />
                  </NPWDButton>
                  {!call.isAnonymous && getDisplay(call.transmitter) === call.transmitter && (
                    <NPWDButton
                      onClick={() =>
                        history.push(
                          `/contacts/-1?addNumber=${call.transmitter}&referal=/phone/contacts`,
                        )
                      }
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                    >
                      <UserRoundPlus size={20} />
                    </NPWDButton>
                  )}
                </div>
              }
              key={call.id}
            />
          ),
        )}
      </List>
    </div>
  );
};
