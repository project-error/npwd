import React, { useEffect, useState } from 'react';
import { Avatar as MuiAvatar, Box, Button, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { useProfiles } from '../../hooks/useProfiles';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
  },
});

const MatchPage = () => {
  const classes = useStyles();
  const { profiles } = useProfiles();

  console.log(profiles);
  return (
    <Paper className={classes.root} square>
      <h1>Match</h1>
    </Paper>
  );
};

export default MatchPage;
