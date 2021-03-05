import React from 'react';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { usePhone } from '../../os/phone/hooks/usePhone';

import { useRecoilState } from 'recoil';
import { settingsState } from '../../apps/settings/hooks/useSettings';
import themeConfig from '../../config/default.json';

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

function Notification({ children, handleClose, open }) {
  const classes = useStyles();
  const { config } = usePhone();

  const [settings] = useRecoilState(settingsState);

  if (!config) return null;

  const { horizontal, vertical } = config.notificationPosition;
  const currentTheme = () => createMuiTheme(themeConfig.themes[settings.theme.value]);

  return (
    <ThemeProvider theme={currentTheme()}>
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
  );
}

export default Notification;
