import React, { useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Tooltip } from '@material-ui/core';
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
    bottom: 0,
    fontSize: 12,
  },
}));

export const GridMenu = ({ items, Component = AppIcon }) => {
  const { t } = useTranslation();
  const setKey = useKeyboard();
  const classes = useStyles();
  useEffect(function registerKeyHandlers() {
    setKey('ArrowLeft', () => {
      console.log(':v');
    });
    // eslint-disable-next-linep
  }, []);

  return (
    <Grid container justify='center'>
      <Grid container item>
        {items &&
          items.length &&
          items.map((item) => (
            <Tooltip
              key={item.id}
              title={t(item.nameLocale)}
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
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
