import React from 'react';
import { Slide } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListItem, List } from '@npwd/keyos';
import { X } from 'lucide-react';

export interface IContextMenuOption {
  onClick(e, option): void;
  label: string;
  description?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  key?: string;
}

interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  options: Array<IContextMenuOption>;
  settingLabel: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  onClose,
  options,
  settingLabel,
}) => {
  const _options = options;

  return (
    <Slide
      direction="up"
      in={open}
      style={{ position: 'absolute', bottom: 0 }}
      mountOnEnter
      unmountOnExit
    >
      <div className="min-h-10%] z-[9999] max-h-full w-full overflow-auto rounded-t-2xl border-t border-neutral-800 bg-neutral-900 p-2 text-white shadow-lg">
        <div className="flex items-center justify-between px-2">
          <p className="text-base font-medium">{settingLabel}</p>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <List>
          {_options.map((option) => (
            <ListItem
              primaryText={option.label}
              secondaryText={option.description}
              button
              selected={option.selected}
              onClick={(e) => {
                option.onClick(e, option);
                onClose();
              }}
            />
            /*  <ListItem
              selected={option.selected}
              key={option.key || option.label}
              button
              onClick={(e) => {
                option.onClick(e, option);
                onClose();
              }}
            >
              {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
              <ListItemText primary={option.label} secondary={option.description} />
            </ListItem> */
          ))}
        </List>
      </div>
    </Slide>
  );
};
