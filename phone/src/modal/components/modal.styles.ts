import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  actions: {
    width: '100%',
    margin: 'auto',
    position: 'absolute',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '10%'
  },
  actionButton: {
    margin: 20,
  }
}))


export default useStyles;