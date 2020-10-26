import React from 'react'
import { makeStyles, Box, Typography } from "@material-ui/core";
import { shadows } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#388CF8',
    height: '179px',
    width: '350px',
    margin: 'auto',
    borderRadius: '15px',
    fontFamily: 'Bahnschrift Regular'
  },
  cardName: {
    margin: 10,
    paddingTop: 15
  },
  cardAccount: {
    margin: '10px',
    marginTop: '10px',
    color: '#DFDFDF',
    fontWeight: 'bold',
    borderBottom: '2px solid #D8D1D1',
    paddingBottom: 5
  },
  balance: {
    position: "absolute",
    bottom: '53%',
    left: '10%'
  },
  balanceFont: {
    fontSize: '29px'
  }
}))

export const BankCard = (props) => {
  const classes = useStyles();
  return (
    <Box boxShadow={5} className={classes.root}>
      <div>
        <h2 className={classes.cardName}>{props.name}</h2>
        <p className={classes.cardAccount}>{props.account}</p>
      </div>
      <div className={classes.balance}>
        <h3 className={classes.balanceFont}><span style={{ fontSize: '30px'}}>$</span>{props.balance}</h3>
      </div>
    </Box>
  )
}
