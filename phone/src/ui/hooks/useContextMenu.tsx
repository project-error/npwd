import React, { useState } from 'react';
import { ContextMenu } from '../components/ContextMenu';

type UseContextMenu = [any, any, () => JSX.Element, boolean];

export interface ISettingItem {
  label: string;
  value: string | number;
}

export const MapSettingItem = (current: ISettingItem, onClick) => (
  item: ISettingItem
) => {
  return {
    selected: current.value === item.value,
    label: item.label,
    key: item.value,
    onClick: () => onClick(item),
  };
};

export const useContextMenu = (_options = []): UseContextMenu => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(_options);

  const onClose = () => setOpen(false);

  const onOpen = (opts) => {
    setOptions(opts);
    setOpen(true);
  };

  return [
    onOpen,
    onClose,
    () => <ContextMenu open={open} onClose={onClose} options={options} />,
    open,
  ];
};
