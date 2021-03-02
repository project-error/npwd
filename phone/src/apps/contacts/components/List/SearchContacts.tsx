import React from 'react';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

import { useFilteredContacts } from '../../hooks/useFilteredContacts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bg: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textFieldInput: {
      fontSize: 20,
    },
    inputRoot: {
      fontSize: 18,
      border: '1px solid',
      borderColor: theme.palette.divider,
    },
    inputInput: {
      padding: theme.spacing(1, 4, 1, 4),
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '13ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
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
  }),
);

export const SearchContacts = () => {
  const { setFilteredContacts } = useFilteredContacts();
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.bg}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          fullWidth
          onChange={(e) => setFilteredContacts(e.target.value)}
          placeholder={t('APPS_CONTACT_PLACEHOLDER_SEARCH_CONTACTS')}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search', autoFocus: true }}
        />
      </div>
    </div>
  );
};
