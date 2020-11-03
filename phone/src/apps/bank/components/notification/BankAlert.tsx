import React, { useState } from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import Notification from '../../../../ui/components/Notification';
import { useBankAlert } from '../../hooks/useBankAlert';
import Snackbar from '@material-ui/core/Snackbar';

export const BankAlert = () => {
  const [ open, setOpen ] = useState(false);
  const { bankAlert, setBankAlert } = useBankAlert()

  

  const _handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar style={{ width: '80%' }} open={open} autoHideDuration={6000} onClose={_handleClose}>
      <MuiAlert style={{ background: '#388CF8' }} onClose={_handleClose} severity="success">
        You transferrred money
      </MuiAlert>
    </Snackbar>
  )
}
