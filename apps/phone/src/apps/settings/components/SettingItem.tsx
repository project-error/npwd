import React from 'react';
import { Typography } from '@mui/material';
import { Tooltip } from '@ui/components/Tooltip';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {
  NPWDButton,
  ListItem as NPWDListItem,
  SwitchRoot,
  SwitchThumb,
  SliderRoot,
} from '@npwd/keyos';
import {LucideIcon} from "lucide-react";

interface SettingItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon
  theme: any;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
  theme,
}) => (
  <NPWDListItem
    onClick={() => onClick?.(options, label)}
    button
    startElement={<Icon size={20} />}
    primaryText={label}
    secondaryText={value ? value.toString() : null}
  />
);

interface SoundItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon;
  tooltip: string;
  onPreviewClicked: any;
  theme: any;
}

export const SoundItem: React.FC<SoundItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
  tooltip,
  onPreviewClicked,
}) => (
  <NPWDListItem
    button
    onClick={() => onClick?.(options, label)}
    primaryText={label}
    secondaryText={value ? value.toString() : undefined}
    startElement={<Icon size={20} />}
    endElement={
      <Tooltip title={tooltip} placement="left" arrow>
        <NPWDButton
          size="icon"
          variant="ghost"
          className="rounded-full text-neutral-900 dark:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onPreviewClicked?.(options, label);
          }}
        >
          <PlayCircleIcon />
        </NPWDButton>
      </Tooltip>
    }
  ></NPWDListItem>
);

interface SettingSliderProps {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (value: number | number[]) => void;
  theme: any;
}

export const SettingItemSlider: React.FC<SettingSliderProps> = ({
  icon,
  label,
  value,
  onCommit,
  theme,
}) => (
  <NPWDListItem
    startElement={icon}
    primaryText={label}
    secondaryText={value ? value.toString() : undefined}
    endElement={
      <div>
        <SliderRoot
          key={`slider-${value}`}
          defaultValue={[value]}
          min={0}
          max={100}
          onValueCommit={(val) => onCommit(val[0])}
        />
      </div>
    }
  />
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
  Icon: LucideIcon;
  actionIcon: JSX.Element;
  label: string;
  labelSecondary: string;
  handleAction: () => void;
  actionLabel: string;
  theme: any;
}

export const SettingItemIconAction: React.FC<SettingItemIconActionProps> = ({
  Icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
  actionLabel,
  theme,
}) => (
  <>
    <NPWDListItem
      startElement={<Icon size={20} />}
      primaryText={label}
      secondaryText={labelSecondary}
      endElement={
        <Tooltip
          arrow
          title={<Typography variant="body2">{actionLabel}</Typography>}
          placement="left"
        >
          <NPWDButton onClick={handleAction} size="icon" variant="ghost" className="rounded-full text-neutral-900 dark:text-white">
            {actionIcon}
          </NPWDButton>
        </Tooltip>
      }
    />
  </>
);
