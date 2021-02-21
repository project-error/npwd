import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  modalRoot: {
    zIndex: 9,
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
  overflowAutoY: {
    overflowY: 'auto',
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
