import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import ProfileIcon from "@material-ui/icons/Person";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export function TwitterBottomNavigation({ activePage, handleChange }) {
  const classes = useStyles();

  return (
    <BottomNavigation
      value={activePage}
      onChange={handleChange}
      className={classes.root}
    >
      <BottomNavigationAction icon={<HomeIcon />} />
      <BottomNavigationAction icon={<SearchIcon />} />
      <BottomNavigationAction icon={<ProfileIcon />} />
    </BottomNavigation>
  );
}

export default TwitterBottomNavigation;
