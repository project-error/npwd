import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      padding: theme.spacing(2),
      overflowY: 'hidden',
    },
    title: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleLeft: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    icon: {
      marginTop: '3px',
      marginRight: '5px',
    },
    heading: {
      marginBottom: '3px',
    },
    justNow: {
      fontSize: '18px',
      fontStyle: 'italic',
      paddingRight: '3px',
    },
    message: {
      fontSize: '16px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
  })
);

export default useStyles;
