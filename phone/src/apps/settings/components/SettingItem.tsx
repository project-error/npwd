import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Box,
  Slider,
  IconButton,
  Typography,
  Switch,
} from '@mui/material';
import { Tooltip } from '@ui/components/Tooltip';

interface ISettingItem {
  options?: any;
  label: string;
  value?: string | object | number | null;
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
  onCommit: (event: React.SyntheticEvent | Event, value: number | number[]) => void;
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

interface ISettingItemIconAction {
  icon: JSX.Element;
  actionIcon: JSX.Element;
  label: string;
  labelSecondary: string;
  handleAction: () => void;
  actionLabel: string;
}

interface ISettingSwitch {
  label: string;
  value: boolean;
  onClick: any;
  icon: JSX.Element;
  secondary: string;
}

export const SettingSwitch = ({ label, value, onClick, icon, secondary }: ISettingSwitch) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} secondary={secondary} />
    <ListItemSecondaryAction>
      <Switch color="primary" checked={value} onChange={() => onClick(value)} />
    </ListItemSecondaryAction>
  </ListItem>
);

export const SettingItemIconAction = ({
  icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
  actionLabel,
}: ISettingItemIconAction) => (
  <>
    <ListItem divider>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={labelSecondary} />
      <ListItemSecondaryAction>
        <Tooltip
          arrow
          title={<Typography variant="body2">{actionLabel}</Typography>}
          placement="top-end"
        >
          <IconButton edge="end" onClick={handleAction} size="large">
            {actionIcon}
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  </>
);
