import React from 'react';
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
  settingLabel?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  onClose,
  options,
  settingLabel,
}) => {
  const _options = options;
  if (!open) return null;

  return (
    <div className="absolute bottom-0 z-[9999] max-h-[70%] min-h-[10%] w-full animate-in slide-in-from-bottom-4 overflow-hidden rounded-t-3xl border-t border-white/10 bg-keyos-panel p-2 text-keyos-cream shadow-keyos-panel backdrop-blur-xl">
      <div className="flex items-center justify-between px-2">
        <p className="text-base font-medium text-keyos-cream">{settingLabel}</p>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-keyos-muted hover:bg-white/10 hover:text-keyos-cream"
        >
          <X size={24} />
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto pb-4">
        <List>
          {_options.map((option) => (
            <ListItem
              key={option.key || option.label}
              startElement={option.icon}
              primaryText={option.label}
              secondaryText={option.description}
              button
              selected={option.selected}
              onClick={(e) => {
                option.onClick(e, option);
                onClose();
              }}
            />
          ))}
        </List>
      </div>
    </div>
  );
};
