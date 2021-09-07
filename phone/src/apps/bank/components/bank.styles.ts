import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    width: '50%',
    backgroundColor: '#2d3436',
    margin: 20,
    color: '#fff',
  },
  table: {
    width: '100%',
    color: '#fff',
  },
  cell: {
    color: '#fff',
  },
  container: {
    maxHeight: 350,
  },
  list: {
    marginTop: '8.5em',
  },
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
    fontSize: '30px',
  },
  seeAll: {
    fontFamily: 'Bahnschrift Regular',
    fontWeight: 'bold',
    height: 'auto',
  },
  transcationDiv: {
    marginTop: '-30px',
    minHeight: 200,
    maxHeight: 240,
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
  pagination: {
    background: '#262525',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    borderBottom: '2px solid #707070',
  },
}));

export default useStyles;
