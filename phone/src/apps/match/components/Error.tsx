import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.primary.main,
    fontSize: theme.typography.fontSize,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '140px',
  },
}));

function NoProfiles() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box className={classes.root}>
      <Typography variant="h5">{t('APPS_MATCH_NO_PROFILES')}</Typography>
    </Box>
  );
}

export default NoProfiles;
