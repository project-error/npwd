import React from 'react';
import {
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Slider,
  Switch,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';

interface IProps {
  options?: any;
  label: string;
  value?: string | number | null;
  onClick: any;
  icon: JSX.Element;
}

export const SettingItem = ({
  options,
  label,
  value,
  onClick,
  icon,
}: IProps) => (
  <>
    <ListItem onClick={() => onClick(options)} button>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={value ? value : undefined} />
    </ListItem>
    <Divider />
  </>
);

interface ISettingItemSlider {
  icon: JSX.Element;
  label: string;
  value: number;
  handleChange: (event: any, newValue: number | number[]) => void;
  min: number;
  max: number;
  step?: number;
}

export const SettingItemSlider = ({
  icon,
  label,
  value,
  handleChange,
  min,
  max,
  step,
}: ISettingItemSlider) => (
  <>
    <ListItem style={{ paddingRight: 25 }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        secondary={
          <Slider
            valueLabelDisplay={'auto'}
            defaultValue={value}
            onChangeCommitted={handleChange}
            min={min}
            max={max}
            step={step ? step : 1}
          />
        }
      />
    </ListItem>
    <Divider />
  </>
);
interface ISettingsItemToggle {
  icon: JSX.Element;
  label: string;
  labelSecondary: string;
  value: boolean;
  handleChange: (event: any, value: boolean) => void;
}

export const SettingItemToggle = ({
  icon,
  label,
  value,
  handleChange,
  labelSecondary,
}: ISettingsItemToggle) => (
  <>
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={labelSecondary} />
      <ListItemSecondaryAction>
        <Switch edge='end' onChange={handleChange} checked={value} />
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
  </>
);

interface ISettingItemIconAction {
  icon: JSX.Element;
  actionIcon: JSX.Element;
  label: string;
  labelSecondary: string;
  handleAction: () => void;
}

export const SettingItemIconAction = ({
  icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
}: ISettingItemIconAction) => (
  <>
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={labelSecondary} />
      <ListItemSecondaryAction>
        <IconButton edge='end' onClick={handleAction}>
          {actionIcon}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
  </>
);
