import React, { useState } from "react";
import { ContextMenu } from "../components/ContextMenu";

export const useContextMenu = (options = []) => {
  const [open, setOpen] = useState();
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  return [onOpen, onClose, () => <ContextMenu open={open} onClose={onClose} options={options} />, open]
};