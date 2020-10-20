import React from 'react'
import Alert from '@material-ui/lab/Alert';
import Notification from '../../../../ui/components/Notification';
import { useBankAlert } from './../../hooks/useBankAlert';

export const BankNotification = ({ alert }) => {
  const { setBankAlert } = useBankAlert();

  const handleClose = () => {
    setBankAlert(false)
  }

  return (
    <Notification handleClose={onClose}>
      <Alert onClose={handleClose}></Alert>
    </Notification>
  )
}
