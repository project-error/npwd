import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Paper, useTheme } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '24px',
    zIndex: 10,
    marginTop: '15px',
    width: '90%',
    display: 'flex',
    flexFlow: 'column nowrap',
    position: 'absolute',
    top: '80px',
  },
  displayBlock: {
    /*Sets modal to center*/
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  displayNone: {
    display: 'none',
  },
  imageModalCloseButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '10%',
    color: theme.palette.text.primary,
  },
}));

interface ModalProps {
  children: React.ReactNode;
  visible?: boolean;
  handleClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, visible, handleClose }) => {
  const phoneTheme = useTheme();
  const classes = useStyles(phoneTheme);

  const showHideClassName = visible ? classes.displayBlock : classes.displayNone;

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <Button onClick={handleClose} className={classes.imageModalCloseButton}>
          <CloseIcon />
        </Button>
        {children}
      </Paper>
    </div>
  );
};

export default Modal;
