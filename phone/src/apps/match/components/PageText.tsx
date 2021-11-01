import React from 'react';
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
    textAlign: 'center',
    padding: '140px 15px 15px 15px',
  },
}));

interface IProps {
  text: string;
}

function PageText({ text }: IProps) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant="h5">{text}</Typography>
    </Box>
  );
}

export default PageText;
