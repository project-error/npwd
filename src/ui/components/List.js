import React from 'react'
import List from '@material-ui/core/List';

export const PhoneList = (props) => {
    
    return (
        <List component='nav' className={props.className} aria-label='mailbox folders'>
                {props.children}
        </List>
    )
}
