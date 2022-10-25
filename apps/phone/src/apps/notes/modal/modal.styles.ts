import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 20,
    position: 'absolute',
    height: '99%',
    width: '100%',
    background: theme.palette.background.default,
  },
  input: {
    marginBottom: 20,
  },
  inputPropsTitle: {
    fontSize: 28,
  },
  inputPropsContent: {
    fontSize: 20,
    lineHeight: 1.2,
  },
}));

export default useStyles;
