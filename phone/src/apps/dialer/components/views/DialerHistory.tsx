import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import { List } from '../../../../ui/components/List';
import { ListItem } from '../../../../ui/components/ListItem';
import Nui from '../../../../os/nui-events/utils/Nui'
import { useSimcard } from '../../../../os/simcard/hooks/useSimcard';
import { useContacts } from '../../../contacts/hooks/useContacts';


export const DialerHistory = ({ calls }) => {
  const { number } = useSimcard();
  const { getDisplayByNumber } = useContacts();

  const handleCall = (phoneNumber) => {
    Nui.send('phone:beginCall', {
       number: phoneNumber
    })
  }

  if (!calls) {
    return <p>Things are loading or arent here at all</p>
  } 

  return (
    <List disablePadding>
      {calls.map((call) => call.transmitter === number ? (
        <ListItem key={call.id} divider button onClick={() => handleCall(call.receiver)}>
          <ListItemText primary={getDisplayByNumber(call.receiver)} secondary={call.timestamp} />
          {<PhoneForwardedIcon />}
        </ListItem>
      ): (
        <ListItem key={call.id} divider button onClick={() => handleCall(call.transmitter)}>
          <ListItemText primary={getDisplayByNumber(call.transmitter)} secondary={call.timestamp} />
          {<PhoneCallbackIcon />}
        </ListItem>
      ))}
    </List>
  );
};
