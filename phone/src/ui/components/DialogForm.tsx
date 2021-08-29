import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, DialogContent, DialogContentText, DialogTitle, Paper } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles({
  root: {
    paddingLeft: '10px',
    zIndex: 10,
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
});

interface DialogFormProps {
  children: React.ReactNode;
  open: boolean;
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // No idea what those types are
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  content: string;
}

const DialogForm: React.FC<DialogFormProps> = ({
  children,
  open,
  handleClose,
  onSubmit,
  title,
  content,
}) => {
  const classes = useStyles();

  const showHideClassName = open ? classes.displayBlock : classes.displayNone;

  return (
    <div className={showHideClassName}>
      <Paper className={classes.root}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={onSubmit}>
            Confirm
          </Button>
        </DialogActions>
      </Paper>
    </div>
  );
};

export default DialogForm;
