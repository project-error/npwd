import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  addMessageFab: {
    position: 'sticky',
    bottom: theme.spacing(2),
    left: theme.spacing(3),
  },
}));

export default useStyles;
