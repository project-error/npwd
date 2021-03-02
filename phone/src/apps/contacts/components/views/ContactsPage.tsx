import React from 'react';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ContactList } from '../List/ContactList';

const useStyles = makeStyles((theme: Theme) => ({
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  icon: {
    color: '#fff',
    fontSize: 30,
  },
}));

export const ContactPage = () => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <>
      <ContactList />
      <Fab
        color="primary"
        onClick={() => history.push('/contacts/-1')}
        className={classes.absolute}
      >
        <PersonAddIcon />
      </Fab>
    </>
  );
};
