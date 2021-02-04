import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppIcon } from './AppIcon';
import { Grid, makeStyles, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useKeyboard } from '../../os/keyboard/hooks/useKeyboard';
import { AppConfiguration } from '../../os/apps/hooks/useApps';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  item: {
    marginTop: theme.spacing(3),
    width: '20%',
  },
  tooltip: {
    bottom: -12,
    fontSize: 12,
  },
}));

interface IProps {
  items: AppConfiguration[];
  Component: (...AppConfiguration) => JSX.Element;
}

export const GridMenu = ({ items, Component = AppIcon }: IProps) => {
  const { t } = useTranslation();
  const setKey = useKeyboard();
  const classes = useStyles();

  useEffect(function registerKeyHandlers() {
    setKey('ArrowLeft', () => {
      console.log(':v');
    });
    // eslint-disable-next-line
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
              placement="top-start"
              classes={{ tooltip: classes.tooltip }}
              arrow
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
