import React from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

export const PhoneList = ({ calls }) => {
    const CallTypeIcon = {'incoming': <PhoneCallbackIcon />, 'outgoing': <PhoneForwardedIcon />}

    return (
        <List>
            {calls.map((call) => (
                <ListItem key={call.id} divider>
                    <ListItemText 
                        primary={call.caller}
                        secondary={call.phoneNumber}
                    />
                    {CallTypeIcon[call.type]}
                </ListItem>
            ))}
        </List>
    )
} 