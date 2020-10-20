import React, { useState } from 'react'
import Modal from '../../../../ui/components/Modal';
import { Button, List, ListItem, TextField } from '@material-ui/core';

import Nui from '../../../../os/nui-events/utils/Nui';

import { useBankModal} from '../../hooks/useBankModal';


export const TransferModal = () => {
  const [ targetID, setTargetID ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ message, setMessage ] = useState('');
  
  const { showBankModal, setShowBankModal } = useBankModal();

  const _handleClose = () => {
    setShowBankModal(false)
  }

  const addTransfer = () => {
    Nui.send('phone:addTransfer', {
      targetID, 
      amount, 
      message
    })
  }

  return (
    <Modal visible={showBankModal} handleClose={_handleClose}>
      <Button onClick={_handleClose}></Button>
      <List>
        <ListItem>
          <TextField 
            placeholder="ID"
            value={targetID}
            onChange={e => setTargetID(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField 
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField 
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </ListItem>
        <Button onClick={addTransfer}>Transfer</Button>
      </List>
    </Modal>
  )
}
