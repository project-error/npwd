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
  input: {
    width: '100%',
    margin: 10
  },
  newGroupForm: {
    position: 'absolute',
    top: 65,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  newGroupSubmitButton: {
    margin: '15px 8px 0px 8px',
  },
  newGroupinput: {
    margin: '0px 8px 15px 8px',
  },
  messagesInput: {
    fontSize: 20
  }
}))

export default useStyles;