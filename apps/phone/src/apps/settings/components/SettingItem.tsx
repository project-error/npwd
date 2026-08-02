import React from 'react';
import { PlayCircle } from 'lucide-react';

import { Tooltip } from '@ui/components/Tooltip';
import {
  NPWDButton,
  ListItem as NPWDListItem,
  SwitchRoot,
  SwitchThumb,
  SliderRoot,
} from '@npwd/keyos';
import { LucideIcon } from 'lucide-react';

interface SettingItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
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
          className="rounded-full text-keyos-fg"
          onClick={(e) => {
            e.stopPropagation();
            onPreviewClicked?.(options, label);
          }}
        >
          <PlayCircle className="size-5" />
        </NPWDButton>
      </Tooltip>
    }
  />
);

interface SettingSliderProps {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (value: number | number[]) => void;
}

export const SettingItemSlider: React.FC<SettingSliderProps> = ({
  icon,
  label,
  value,
  onCommit,
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
}

export const SettingItemIconAction: React.FC<SettingItemIconActionProps> = ({
  Icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
  actionLabel,
}) => (
  <NPWDListItem
    startElement={<Icon size={20} />}
    primaryText={label}
    secondaryText={labelSecondary}
    endElement={
      <Tooltip arrow title={actionLabel} placement="left">
        <NPWDButton onClick={handleAction} size="icon" variant="ghost" className="rounded-full text-keyos-fg">
          {actionIcon}
        </NPWDButton>
      </Tooltip>
    }
  />
);
