import React, { useState } from 'react'
import { InputBase } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';

import { useFilteredContacts } from '../../hooks/useFilteredContacts';


const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    bg: {
      backgroundColor: "#232323",
      display: 'flex',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textFieldInput: {
      fontSize: 20
    },
    inputRoot: {
      color: '#fff',
      fontSize: 18
    },
    inputInput: {
      padding: theme.spacing(1, 2, 1, 2),
      // vertical padding + font size from searchIcon
      transition: theme.transitions.create('width'),
      width: '100%',
      
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
      backgroundColor: fade(theme.palette.common.white, 0.15),
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
  })
);

export const SearchContacts = () => {

  const { setFilteredContacts } = useFilteredContacts();

  const classes = useStyles();
  const [ searchValue, setSearchValue ] = useState('')


  const handleChange = (e) => {
    setSearchValue(e.target.value)
    setFilteredContacts(e.target.value)
  }

  return (
    <div className={classes.bg}>
      <div className={classes.search}>
        <InputBase
          onChange={handleChange}
          placeholder="Search contacts..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </div>
  )
}
