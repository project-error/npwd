import { makeStyles, Theme } from '@material-ui/core/styles';

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
  absolute: {
    position: 'sticky',
    bottom: theme.spacing(2),
    left: theme.spacing(3),
  },
  // title
  root: {
    height: '60px',
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#424242',
  },
  icon: {
    color: '#fff',
    fontSize: 30,
  },
}));

export default useStyles;
