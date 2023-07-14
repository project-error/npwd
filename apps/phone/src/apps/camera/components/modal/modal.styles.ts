import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
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
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  modalHide: {
    display: 'none',
  },
  image: {
    width: 'auto',
    height: 380,
    maxWidth: 'auto',
    maxHeight: 380,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    marginTop: '4em',
  },
  actionDiv: {
    marginTop: 15,
    display: 'flex',
    justifyContent: 'space-evenly',
  },

  // share modal
  shareModal: {
    marginBottom: 50,
  },
  innerShareModal: {
    marginTop: 40,
    textAlign: 'center',
  },
  button: {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  },
}));

export default useStyles;
