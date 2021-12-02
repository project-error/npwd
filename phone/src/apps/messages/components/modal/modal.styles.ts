import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  modalRoot: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
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
    flexGrow: 1,
    flexFlow: 'row wrap',
    flexDirection: 'column',
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
