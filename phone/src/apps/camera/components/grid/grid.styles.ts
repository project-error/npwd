import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1
  },
  photo: {
    border: '1px inset #fff',
    height: 129,
    width: 129,
    maxWidth: 150,
    maxHeight: 150,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}))

export default useStyles;