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
} from '@mui/material';
import { Tooltip } from '@ui/components/Tooltip';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { NPWDButton, ListItem as NPWDListItem, SwitchRoot, SwitchThumb } from '@npwd/keyos';

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
  theme,
}) => (
  <NPWDListItem
    onClick={() => onClick?.(options, label)}
    button
    startElement={icon}
    primaryText={label}
    secondaryText={value ? value.toString() : null}
  />
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
}) => (
  <NPWDListItem
    button
    onClick={() => onClick?.(options, label)}
    primaryText={label} 
    secondaryText={value ? value.toString() : undefined}
    startElement={icon}
    endElement={
      <Tooltip title={tooltip} placement='left' arrow>
        <NPWDButton size="icon" variant='ghost' className='rounded-full' onClick={(e) => {
          e.stopPropagation();
          onPreviewClicked?.(options, label);
        }}>
          <PlayCircleIcon />
        </NPWDButton>
      </Tooltip>
    }
  >
  </NPWDListItem>
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
  theme,
}) => (
  <ListItem divider>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText
      primary={<Typography style={{ color: theme.palette.text.primary }}>{label}</Typography>}
      secondary={
        <Typography style={{ color: theme.palette.text.secondary }}>
          {value ? value : undefined}
        </Typography>
      }
    />
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
}) => (
  <NPWDListItem
    startElement={icon}
    primaryText={label}
    secondaryText={secondary}
    endElement={
      <SwitchRoot checked={value} onCheckedChange={() => onClick(value)}>
        <SwitchThumb />
      </SwitchRoot>
    }
  />
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
  theme,
}) => (
  <>
    <NPWDListItem
      startElement={icon}
      primaryText={label}
      secondaryText={labelSecondary}
      endElement={
        <Tooltip
          arrow
          title={<Typography variant="body2">{actionLabel}</Typography>}
          placement="left"
        >
          <NPWDButton onClick={handleAction} size="icon" variant="ghost" className="rounded-full">
            {actionIcon}
          </NPWDButton>
        </Tooltip>
      }
    />
  </>
);
