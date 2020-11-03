import React from 'react'
import { InputBase, Paper } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";

import useStyles from './list.styles';

export const MessageSearch = () => {
  const classes = useStyles();
  return (
    <Paper elevation={24} variant="outlined" className={classes.bg}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          //onChange={handleChange}
          placeholder="Search contacts..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
    </Paper>
  )
}
