import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sendButton: {
    float: 'right'
  },
  paper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  form: {
    display: 'flex',
  },
  formTop: {
    position: 'absolute',
    top: 65,
    display: 'flex',
    width: '100%',
  },
  input: {
    width: '100%',
    margin: 10
  },
  messagesInput: {
    fontSize: 20
  }
}))

export default useStyles;