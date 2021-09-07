import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
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
  absolute: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(5),
  },
}));

export default useStyles;
