import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 20,
    position: 'absolute',
    height: '100%',
    width: '100%',
    background: theme.palette.background.default,
  },
  input: {
    marginBottom: 20,
  },
  inputPropsTitle: {
    fontSize: 28,
  },
  inputPropsContent: {
    fontSize: 20,
    lineHeight: 1.2
  },
  saveButton: {
    padding: '10px 30px',
  },
  updateButton: {
    padding: '10px 30px',
    marginRight: '8px',
  },
  deleteButton: {
    padding: '10px 30px',
  },
}));

export default useStyles;
