import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

export function Alert(props) {
  return <MuiAlert style={{ zIndex: 10000 }} elevation={6} variant='filled' {...props} />;
}

export default Alert;
