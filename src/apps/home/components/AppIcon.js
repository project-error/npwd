import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useSettings } from "../../settings/hooks/useSettings";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    avatar: {
      width: theme.spacing(8),
      height: theme.spacing(8),
      fontSize: theme.typography.h4.fontSize
    },
  }));

export const AppIcon = ({ label, icon }) => {
  const [settings] = useSettings();
  const classes = useStyles();
  return <Button className={classes.root}><Avatar className={classes.avatar}>{label[0].toUpperCase()}</Avatar></Button>;
};
