import * as Switch from '@radix-ui/react-switch';
import React from 'react';

export const SwitchRoot: React.FC<Switch.SwitchProps> = ({ children, ...props }) => {
  return (
    <Switch.Root
      className="relative h-[25px] w-[42px] cursor-default rounded-full outline-none bg-neutral-400 dark:bg-neutral-700 data-[state=checked]:bg-neutral-900 data-[state=checked]:dark:bg-white"
      id="airplane-mode"
      {...props}
    >
      {children}
    </Switch.Root>
  );
};

export const SwitchThumb: React.FC<Switch.SwitchThumbProps> = ({ ...props }) => {
  return (
    <Switch.Thumb
      className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-black transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:dark:bg-neutral-900"
      {...props}
    />
  );
};
