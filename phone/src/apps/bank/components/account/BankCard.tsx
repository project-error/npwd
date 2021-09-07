import React from 'react';
import { Box } from '@mui/material';
import useStyles from './card.styles';

export const BankCard = (props) => {
  const classes = useStyles();
  return (
    <Box boxShadow={5} className={classes.root}>
      <div>
        <h2 className={classes.cardName}>{props.name}</h2>
        <p className={classes.cardAccount}>{props.account}</p>
      </div>
      <div className={classes.balance}>
        <h3 className={classes.balanceFont}>
          <span style={{ fontSize: '30px' }}>$</span>
          {props.balance}
        </h3>
      </div>
    </Box>
  );
};
