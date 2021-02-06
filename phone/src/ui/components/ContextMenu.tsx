import React from 'react';
import {
  ListItemIcon,
  ListItemText,
  Slide,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { List } from './List';
import { ListItem } from './ListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
}));

interface IContextMenuProps {
  open: boolean;
  onClose(): void;
  options: Array<{
    onClick(e, option): void;
    label: string;
    selected?: boolean;
    icon?: React.ReactNode;
    key?: string;
  }>;
}

export const ContextMenu = ({ open, onClose, options }: IContextMenuProps) => {
  const classes = useStyles();
  return (
    <Slide direction='up' in={open} mountOnEnter unmountOnExit>
      <Paper square className={classes.root}>
        <List disablePadding>
          {options.map((option) => (
            <ListItem
              selected={option.selected}
              key={option.key || option.label}
              button
              onClick={(e) => {
                option.onClick(e, option);
                onClose();
              }}
            >
              {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Slide>
  );
};
