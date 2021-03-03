import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Box,
  Slider,
} from '@material-ui/core';

interface ISettingItem {
  options?: any;
  label: string;
  value?: string | number | null;
  onClick?: any;
  icon: JSX.Element;
}

export const SettingItem = ({ options, label, value, onClick, icon }: ISettingItem) => (
  <ListItem divider onClick={() => onClick?.(options)} button>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} secondary={value ? value : undefined} />
  </ListItem>
);

interface ISettingSlider {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (event: React.ChangeEvent<{}>, value: number | number[]) => void;
}

export const SettingItemSlider = ({ icon, label, value, onCommit }: ISettingSlider) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} secondary={`${value}%`} />
    <ListItemSecondaryAction>
      <Box p={2} width={150}>
        <Slider
          key={`slider-${value}`}
          defaultValue={value}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChangeCommitted={onCommit}
        />
      </Box>
    </ListItemSecondaryAction>
  </ListItem>
);
