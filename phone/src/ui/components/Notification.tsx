import React from "react";
import { ThemeProvider } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from "@material-ui/core/styles";
import { useSettings } from "../../apps/settings/hooks/useSettings";

const useStyles = makeStyles({
  paper: {
    width: '350px',
    height: '85px',
    opacity: '0.93',
  }
});

function Notification({ key, children, handleClose, open }) {
  const classes = useStyles();
  const { currentTheme } = useSettings();
  return (
    <ThemeProvider theme={currentTheme()}>
        <Snackbar
            key={key}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
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
