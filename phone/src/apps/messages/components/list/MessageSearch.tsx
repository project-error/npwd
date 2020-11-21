import React from "react";
import { InputBase, Paper } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import useStyles from "./list.styles";

interface IProps {
  value: string;
  handleChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const MessageSearch = ({ value, handleChange }: IProps) => {
  const classes = useStyles();
  return (
    <Paper elevation={24} variant="outlined" className={classes.bg}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={value}
          onChange={handleChange}
          placeholder="Search contacts..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
    </Paper>
  );
};

export default MessageSearch;
