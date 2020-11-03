import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sendButton: {
    float: 'right'
  },
  form: {
    position: 'absolute',
    bottom: 0,
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