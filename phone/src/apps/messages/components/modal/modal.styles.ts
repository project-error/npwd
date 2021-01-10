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
  topContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    padding: '3px 0px',
  },
  groupdisplay: {
    width: '300px',
    paddingTop: '8px',
    fontSize: '24px',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  largeGroupDisplay: {
    width: '300px',
    paddingTop: '8px',
    fontSize: '20px',
  },
  messageList: {
    height: '90%',
    overflowY: 'auto',
    paddingBottom: '40px',
  },
  messageContainer: {
    marginTop: 25,
    width: '100%',
  },
  sourceSms: {
    float: 'right',
    margin: 10,
    padding: '6px 12px',
    height: 'auto',
    width: '80%',
    background: '#0288d1',
    borderRadius: '20px',
    textOverflow: 'ellipsis',
  },
  sms: {
    float: 'left',
    margin: 10,
    padding: '6px 12px',
    width: '80%',
    height: 'auto',
    background: '#ddd',
    color: '#232323',
    borderRadius: '15px',
    textOverflow: 'ellipsis',
  },
  messagesInput: {
    fontSize: 20,
  },
  input: {
    width: '100%',
    margin: 10,
  },
  imageMessage: {
    width: '80%',
    maxWidth: '80%',
    height: '80%',
    maxHeight: '80%',
  },
  imageModalCloseButton: {
    position: 'absolute',
    right: 0,
    width: '10%',
  },
}));

export default useStyles;
