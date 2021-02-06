import React, { useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Tooltip, Zoom } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useKeyboard } from '../../os/keyboard/hooks/useKeyboard';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  item: {
    marginTop: theme.spacing(3),
    width: '20%',
  },
  tooltip: {
    fontSize: 12,
  },
}));

export const GridMenu = ({ items, Component = AppIcon }) => {
  const setKey = useKeyboard();
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(function registerKeyHandlers() {
    setKey('ArrowLeft', () => {
      console.log(':v');
    });
    // eslint-disable-next-line
  }, []);
  // TODO: Fix tooltip position to be closer to app icon
  return (
    <Grid container justify='center'>
      <Grid container item>
        {items &&
          items.length &&
          items.map((item) => (
            <Tooltip
              arrow
              key={item.id}
              title={t(item.nameLocale)}
              placement='top'
              classes={{ tooltip: classes.tooltip }}
              TransitionComponent={Zoom}
            >
              <Grid
                key={item.id}
                item
                className={classes.item}
                component={Link}
                to={item.path}
              >
                <Component {...item} />
              </Grid>
            </Tooltip>
          ))}
      </Grid>
    </Grid>
  );
};
