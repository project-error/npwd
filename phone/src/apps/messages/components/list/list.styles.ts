import { makeStyles, fade } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    overflowY: 'auto',
  },
  bg: {
    display: 'flex',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFieldInput: {
    fontSize: 20,
  },
  inputRoot: {
    fontWeight: 400,
    fontSize: 18,
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
  inputInput: {
    padding: theme.spacing(1, 4, 1, 4),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      width: '13ch',
      '&:focus': {
        width: '24ch',
      },
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.25),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0.5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;
