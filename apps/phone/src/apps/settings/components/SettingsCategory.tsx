import { ListSubheader } from '@mui/material';
import React from 'react';
import { ListProps } from '@mui/material/List';
import { List } from '@npwd/keyos';

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
  <div className='px-4'>
    <div>
      <p className='text-neutral-900 dark:text-white font-medium text-base'>{title}</p>
    </div>
    <List {...otherProps}>{children}</List>
  </div>
);
