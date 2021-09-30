import React from 'react';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { usePhone } from '../../os/phone/hooks/usePhone';

import { usePhoneTheme } from '../../os/phone/hooks/usePhoneTheme';

const useStyles = makeStyles({
  paper: {
    width: '350px',
    height: '100px',
    opacity: '0.93',
  },
  snackBar: {
    zIndex: -5, // we want this to appear behind other active NUI events...probably
  },
});

interface NotificationProps {
  open: boolean;
  handleClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ children, handleClose, open }) => {
  const classes = useStyles();
  const { ResourceConfig } = usePhone();

  const currentTheme = usePhoneTheme();

  if (!ResourceConfig) return null;

  const { horizontal, vertical } = ResourceConfig.notificationPosition;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={currentTheme}>
        <Snackbar
          className={classes.snackBar}
          anchorOrigin={{ horizontal, vertical }}
          ClickAwayListenerProps={{
            onClickAway: () =>
              setTimeout(() => {
                handleClose();
              }, 5000),
          }}
          onClose={handleClose}
          open={open}
          TransitionComponent={Fade}
          autoHideDuration={6000}
        >
          <Paper className={classes.paper}>{children}</Paper>
        </Snackbar>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Notification;
