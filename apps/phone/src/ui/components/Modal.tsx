import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Dialog, DialogContent, Paper, useTheme } from '@mui/material';
import * as DialogRadix from '@radix-ui/react-dialog';

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

export const Modal2 = ({ children, visible, handleClose }) => {
  return (
    <DialogRadix.Root open={visible} onOpenChange={handleClose}>
      <DialogRadix.Portal container={document.getElementById('phone')}>
        <DialogRadix.Overlay className="bg-black/50 fixed inset-0 absolute inset-0" />
        <DialogRadix.Content className="absolute left-[50%] top-[30%] max-h-[100vh] w-[80vw] max-w-[350px] translate-x-[-50%] translate-y-[-50%]  rounded-[6px] bg-neutral-800 p-[25px]">
          {children}
        </DialogRadix.Content>
      </DialogRadix.Portal>
    </DialogRadix.Root>
  );
};

export default Modal;
