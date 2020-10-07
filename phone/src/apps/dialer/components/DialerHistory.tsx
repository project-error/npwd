import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";
import PhoneForwardedIcon from "@material-ui/icons/PhoneForwarded";
import { List } from "../../../ui/components/List";
import { ListItem } from "../../../ui/components/ListItem";

const CallTypeIcon = {
  incoming: <PhoneCallbackIcon />,
  outgoing: <PhoneForwardedIcon />,
};

export const DialerHistory = ({ calls }) => {
  return (
    <List>
      {calls.map((call) => (
        <ListItem key={call.id} divider>
          <ListItemText primary={call.caller} secondary={call.phoneNumber} />
          {CallTypeIcon[call.type]}
        </ListItem>
      ))}
    </List>
  );
};
