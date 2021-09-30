import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: '#388CF8',
    height: '179px',
    width: '350px',
    margin: 'auto',
    borderRadius: '15px',
    fontFamily: 'Bahnschrift Regular',
  },
  cardName: {
    margin: 10,
    paddingTop: 15,
    fontSize: '24px',
  },
  cardAccount: {
    margin: '10px',
    marginTop: '10px',
    color: '#DFDFDF',
    fontWeight: 'bold',
    borderBottom: '2px solid #D8D1D1',
    paddingBottom: 5,
  },
  balance: {
    position: 'absolute',
    bottom: '53%',
    left: '10%',
  },
  balanceFont: {
    fontSize: '29px',
  },
}));

export default useStyles;
