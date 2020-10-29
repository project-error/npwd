import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 20,
    position: "absolute",
    height: '100%',
    width: '100%',
    background: '#232323',
  },
  modalHide: {
    display: 'none'
  },
  closeButton: {
    width: '10%',
    position: 'absolute',
    top: 10,
    left: 0
  },
  noteContainer: {
    width: '90%',
    marginTop: 80,
    margin: '0 auto',
  },
  input: {
    marginBottom: 20,
  },
  inputPropsTitle: {
    fontSize: 28,
  },
  inputPropsContent: {
    fontSize: 20,
  },
  saveButton: {
    background: '#f9a825',
    padding: '10px 30px'
  },
  deleteButton: {
    marginLeft: 20,
    background: '#c62828',
    padding: '10px 30px'
  }
}))

export default useStyles;