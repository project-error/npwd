import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 10,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  modalHide: {
    display: 'none',
  },
  listContainer: {
    marginTop: 30,
    width: '75%',
    margin: '0 auto',
    textAlign: 'center',
  },
  avatar: {
    margin: 'auto',
    height: '125px',
    width: '124px',
    marginBottom: 29,
  },
  input: {
    marginBottom: 20,
    margin: 'auto',
    textAlign: 'center',
  },
  inputProps: {
    fontSize: 22,
  },
  updateButton: {
    background: '#2196f3',
    width: 150,
    height: 45,
    fontSize: 16,
    marginTop: 29,
    marginBottom: 29,
  },
  deleteButton: {
    background: '#d32f2f',
    width: 150,
    height: 40,
    fontSize: 16,
  },
}));

export default useStyles;
