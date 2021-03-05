import React, { useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';

const useStyles = makeStyles({
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
  },
});

export const Modal = ({ children, visible, handleClose }) => {
  const classes = useStyles();

  // when the user presses escape we should close the modal
  const _handleEscape = (e) => {
    e.stopPropagation();
    const isEscapeKey = e.key === 'Escape' || e.key === 'Esc';
    if (isEscapeKey) {
      e.preventDefault();
      handleClose();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', _handleEscape, true);
    return () => window.removeEventListener('keydown', _handleEscape);
  });

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
