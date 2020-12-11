import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: 5,
    marginTop: 20,
  },
  root: {
    position: 'fixed',
    bottom: 380,
    zIndex: 2,
    background: '#232323',
    marginLeft: '-4em',
    height: '20%',
  },
  clearButton: {
    width: '10%',
    position: 'absolute',
    right: 0,
  },
  textInputField: {
    fontSize: 20,
    borderBottomColor: 'red',
  },
  addBtn: {
    margin: 'auto',
    fontSize: 16,
    width: 150,
    background: '#2196f3',
    marginBottom: 10,
    padding: 8,
  },
  cancelBtn: {
    margin: 'auto',
    width: 150,
    background: '#232323',
    marginBottom: 20,
    padding: 8,
  },
  icons: {
    marginRight: 5,
  },
}));

export default useStyles;
