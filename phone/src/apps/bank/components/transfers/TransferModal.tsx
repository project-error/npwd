import React, { useState } from 'react'
import Modal from '../../../../ui/components/Modal';
import { Button, List, ListItem, TextField, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Nui from '../../../../os/nui-events/utils/Nui';

import { useBankModal} from '../../hooks/useBankModal';
import { Message } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  input: {
    width: "60%",
    margin: 'auto',

  },
  modalInput: {
    fontSize: 20
  },
  modalInputCenter: {
    fontSize: 20,
    textAlign: 'center',
  },
  transferButton: {
    background: "#2E7D32",
    width: 120,
    padding: 5,
    margin: "auto",
    fontSize: 16,
    marginBottom: 30
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    width: "10%"
  }
}))


export const TransferModal = () => {
  const classes = useStyles();

  const [ targetID, setTargetID ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ message, setMessage ] = useState('');
  
  const { showBankModal, setShowBankModal } = useBankModal();

  const _handleClose = () => {
    setShowBankModal(false)
  }

  const addTransfer = () => {
    const transferAmount = parseInt(amount);
    Nui.send('phone:addTransfer', {
      targetID, 
      transferAmount, 
      message
    })
    setShowBankModal(false)
  }

  return (
    <Modal visible={showBankModal} handleClose={_handleClose}>
      <Button className={classes.closeButton} onClick={_handleClose}><CloseIcon /></Button>
      <List style={{ marginTop: 20 }}>
        <ListItem>
          <TextField
            inputProps={{ className: classes.modalInputCenter }}
            fullWidth
            type="number"
            placeholder="ID"
            value={targetID}
            onChange={e => setTargetID(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField 
            inputProps={{ className: classes.modalInputCenter }}
            placeholder="Amount"
            fullWidth
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            inputProps={{ className: classes.modalInput }} 
            placeholder="Message"
            fullWidth
            value={message}
            multiline
            onChange={e => setMessage(e.target.value)}
          />
        </ListItem>
      </List>
      <Button className={classes.transferButton} onClick={addTransfer}>Transfer</Button>
    </Modal>
  )
}
