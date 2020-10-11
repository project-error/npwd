import React, { useState } from "react";
import { ContextMenu } from "../components/ContextMenu";

type UseContextMenu = [any, any, () => JSX.Element, boolean];

export const MapStringOptions = (current, onClick) => (string) => {
  return {
    selected: current === string,
    label: string,
    key: string,
    onClick: () => onClick(string),
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
