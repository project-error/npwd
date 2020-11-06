import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 10,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  modalHide: {
    display: 'none'
  },
  messageContainer: {
    marginTop: 25,
    width: '100%'
  },
  sourceSms: {
    float: 'right',
    marginBottom: 20,
    margin: 10,
    width: 200,
    background: '#0288d1',
    paddingLeft: 5
  },
  sms: {
    float: 'left',
    marginBottom: 20,
    margin: 10,
    minWidth: 200,
    maxWidth: 400,
    background: '#ddd',
    color: '#232323',
    paddingLeft: 5
  }
}))

export default useStyles;