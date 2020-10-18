import React from "react";
import { ThemeProvider } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from "@material-ui/core/styles";
import { useSettings } from "../../apps/settings/hooks/useSettings";
import { usePhone } from "../../os/phone/hooks/usePhone";

const useStyles = makeStyles({
  paper: {
    width: '350px',
    height: '100px',
    opacity: '0.93',
  }
});

function Notification({ children, handleClose, open }) {
  const classes = useStyles();
  const { currentTheme } = useSettings();
  const { config } = usePhone();

  if (!config) return null;

  const { horizontal, vertical } = config.notificationPosition;

  return (
    <ThemeProvider theme={currentTheme()}>
        <Snackbar
            anchorOrigin={{ horizontal, vertical }}
            ClickAwayListenerProps={{ onClickAway: () => null }}
            onClose={handleClose}
            open={open}
            TransitionComponent={Fade}
            autoHideDuration={6000}
        >
            <Paper className={classes.paper}>
                {children}
            </Paper>
        </Snackbar>
    </ThemeProvider>
  );
}


export default Notification;
