import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Box, IconButton, makeStyles, Slide } from '@material-ui/core';
import { useNotifications } from '../hooks/useNotifications';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    marginTop: '-710px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    '& .MuiAlert-action': {
      top: theme.spacing(1),
      right: theme.spacing(2),
      position: 'absolute',
    },
    position: 'relative',
    cursor: 'pointer',
    width: '370px',
    height: '120px',
    zIndex: 50,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    '& .MuiAlert-icon': {
      color: theme.palette.text.primary,
    },
  },
  alertContent: {
    wordBreak: 'break-all',
    display: '-webkit-box',
    maxWidth: '360px',
    height: '60px',
    margin: '0 auto',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export const NotificationAlert = () => {
  const classes = useStyles();
  const { currentAlert } = useNotifications();

  return (
    <div className={classes.snackbar}>
      <Slide in={!!currentAlert} mountOnEnter unmountOnExit>
        <Alert
          action={
            <IconButton
              color='primary'
              size='small'
              onClick={(e) => {
                e.stopPropagation();
                currentAlert?.onCloseAlert(e);
              }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          }
          onClick={(e) => currentAlert?.onClickAlert(e)}
          icon={currentAlert?.icon || false}
          className={classes.alert}
          elevation={6}
        >
          <AlertTitle>
            <Box width='282px' whiteSpace='nowrap'>
              <Box overflow='hidden' component='div' textOverflow='ellipsis'>
                {currentAlert?.title}
              </Box>
            </Box>
          </AlertTitle>
          <Box component='div' className={classes.alertContent}>
            {currentAlert?.content}
          </Box>
        </Alert>
      </Slide>
    </div>
  );
};
