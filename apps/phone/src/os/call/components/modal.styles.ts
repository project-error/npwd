import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  actions: {
    width: '100%',
    margin: 'auto',
    position: 'absolute',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '10%',
  },
  actionButton: {
    margin: 10,
  },
}));

export default useStyles;
