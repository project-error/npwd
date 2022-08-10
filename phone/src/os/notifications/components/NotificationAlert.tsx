import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Slide } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNotifications } from '../hooks/useNotifications';
import { Alert, AlertTitle } from '@mui/material';
import { useCurrentCall } from '@os/call/hooks/state';

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
    height: '80px',
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
    height: '20px',
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
  const call = useCurrentCall();

  return (
    <div className={classes.snackbar}>
      <Slide in={!!currentAlert} mountOnEnter unmountOnExit>
        <Alert
          action={
            <IconButton
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                currentAlert?.onCloseAlert(e);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          onClick={(e) => {
            if (!call) {
              currentAlert?.onClickAlert(e);
            }
          }}
          icon={currentAlert?.icon || false}
          className={classes.alert}
          elevation={6}
        >
          <AlertTitle>
            <Box width="282px" whiteSpace="nowrap">
              <Box overflow="hidden" component="div" textOverflow="ellipsis">
                {currentAlert?.title}
              </Box>
            </Box>
          </AlertTitle>
          <Box component="div" className={classes.alertContent} textOverflow="ellipsis">
            {currentAlert?.content}
          </Box>
        </Alert>
      </Slide>
    </div>
  );
};
