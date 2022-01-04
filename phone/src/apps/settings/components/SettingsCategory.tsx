import { List, ListSubheader } from '@mui/material';
import React from 'react';
import { ListProps } from '@mui/material/List';

const SubHeaderComp: React.FC<{ text: string }> = ({ text }) => (
  <ListSubheader color="primary" component="div" disableSticky>
    {text}
  </ListSubheader>
);

interface SettingsCategoryProps extends ListProps {
  title: string;
}

export const SettingsCategory: React.FC<SettingsCategoryProps> = ({
  children,
  title,
  ...otherProps
}) => (
  <List subheader={<SubHeaderComp text={title} />} {...otherProps} disablePadding>
    {children}
  </List>
);
