import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  header: {
    width: '90%',
    display: 'flex',
    justifyItems: 'center',
    justifyContent: 'space-between',
    margin: 'auto',
  },
  title: {
    padding: 7,
    borderRadius: '10px',
    display: 'flex',
    justifyItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  seeAll: {
    fontFamily: 'Bahnschrift Regular',
    fontWeight: 'bold',
    height: 'auto',
  },
  transcationDiv: {
    marginTop: '-30px',
  },
  transactions: {
    marginLeft: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid #707070',
    width: '85%',
    margin: 'auto',
  },
  tranSource: {
    fontSize: '22px',
  },
  tranType: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#BFBFBF',
    marginTop: '-18px',
    width: '100%',
  },

  depositType: {
    color: '#55B452',
    marginRight: '32px',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  withdrawType: {
    color: '#FF5E5E',
    marginRight: '32px',
    fontSize: '22px',
    fontWeight: 'bold',
  },
}));

export default useStyles;
