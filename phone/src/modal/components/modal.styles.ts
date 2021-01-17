import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  actions: {
    width: '100%',
    margin: 'auto',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '5em'
  },
  actionButton: {
    margin: 20
  }
}))


export default useStyles;