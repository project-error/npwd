import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemSecondaryAction,
  Box,
  Slider,
  IconButton,
  Typography,
  Switch,
} from '@mui/material';
import { Tooltip } from '@ui/components/Tooltip';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface SettingItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  icon: JSX.Element;
  theme: any;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  options,
  label,
  value,
  onClick,
  icon,
  theme
}) => (
  <ListItem divider onClick={() => onClick?.(options)} button>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={<Typography style={{ color: theme.palette.text.primary }}>{label}</Typography>} secondary={<Typography style={{ color: theme.palette.text.secondary }}>{value ? value : undefined}</Typography>} />
  </ListItem>
);

interface SoundItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  icon: JSX.Element;
  tooltip: string;
  onPreviewClicked: any;
  theme: any;
}

export const SoundItem: React.FC<SoundItemProps> = ({
  options,
  label,
  value,
  onClick,
  icon,
  tooltip,
  onPreviewClicked,
  theme
}) => (
  <ListItem
    divider
    button
    secondaryAction={
      <Tooltip title={tooltip}>
        <IconButton onClick={() => onPreviewClicked()}>
          <PlayCircleIcon />
        </IconButton>
      </Tooltip>
    }
    disablePadding
  >
    <ListItemButton onClick={() => onClick?.(options)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={<Typography style={{ color: theme.palette.text.primary }}>{label}</Typography>} secondary={<Typography style={{ color: theme.palette.text.secondary }}>{value ? value : undefined}</Typography>} />
    </ListItemButton>
  </ListItem>
);

interface SettingSliderProps {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (event: React.SyntheticEvent | Event, value: number | number[]) => void;
  theme: any;
}

export const SettingItemSlider: React.FC<SettingSliderProps> = ({
  icon,
  label,
  value,
  onCommit,
  theme
}) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={<Typography style={{ color: theme.palette.text.primary }}>{label}</Typography>} secondary={<Typography style={{ color: theme.palette.text.secondary }}>{value ? value : undefined}</Typography>} />
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

interface SettingSwitchProps {
  label: string;
  value: boolean;
  onClick: any;
  icon: JSX.Element;
  secondary: string;
  theme: any;
}

export const SettingSwitch: React.FC<SettingSwitchProps> = ({
  label,
  value,
  onClick,
  icon,
  secondary,
  theme
}) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={<Typography style={{ color: theme.palette.text.primary }}>{label}</Typography>} secondary={<Typography style={{ color: theme.palette.text.secondary }}>{secondary}</Typography>} />
    <ListItemSecondaryAction>
      <Switch color="primary" checked={value} onChange={() => onClick(value)} />
    </ListItemSecondaryAction>
  </ListItem>
);

interface SettingItemIconActionProps {
  icon: JSX.Element;
  actionIcon: JSX.Element;
  label: string;
  labelSecondary: string;
  handleAction: () => void;
  actionLabel: string;
  theme: any;
}

export const SettingItemIconAction: React.FC<SettingItemIconActionProps> = ({
  icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
  actionLabel,
  theme
}) => (
  <>
    <ListItem divider>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={<Typography style={{ color: theme.palette.text.primary }}>{label}</Typography>} secondary={<Typography style={{ color: theme.palette.text.secondary }}>{labelSecondary}</Typography>} />
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
