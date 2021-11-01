import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  modalRoot: {
    zIndex: 9,
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'hidden',
  },
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  tooltip: {
    fontSize: 12,
  },
  modalHide: {
    display: 'none',
  },
  conversationHeader: {
    zIndex: 10,
  },
  conversationContainer: {
    zIndex: -1,
    display: 'flex',
    flexFlow: 'row wrap',
    flexDirection: 'column',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
  },
  overflowAutoY: {
    height: '550px',
    overflowY: 'auto',
    overflowX: 'hidden',
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
  messagesInput: {
    fontSize: 20,
  },
});

export default useStyles;
